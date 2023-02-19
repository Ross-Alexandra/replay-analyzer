import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Layer } from '../../../../components';
import { cleanActivityFeed, convertObjectToTable, exportDataToCSV, getActivityFeeds } from './helpers';

const githubIssuesLInk = 'https://github.com/Ross-Alexandra/replay-analyzer/issues';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .coming-soon {

    }

    .button-row {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: 15px;
    }

    pre {
        color: white;
    }
`;

function exportActivityFeedToCSV(rounds: Round[]) {
    const feed = getActivityFeeds(rounds);
    const cleanedFeeds = cleanActivityFeed(feed);
    const feedTable = convertObjectToTable(cleanedFeeds);

    exportDataToCSV(feedTable, 'activity_feed.csv');
}

export const Analyze: React.FC<AnalyzeProps> = ({
    className,
    currentStage,
    roundData,
}) => {
    const [viewRaw, setViewRaw] = useState(false);
    const toggleViewRaw = useCallback(() => setViewRaw(currentViewRaw => !currentViewRaw), []);

    return (
        <Wrapper className={className}>
            <h2>Analyze Rounds</h2>
            {currentStage === 'analyze' &&
                <>
                    <div className='coming-soon'>
                        <p>
                            Currently the only supported utility is exporting the activity feed.
                            If you&apos;d like to see more features, or find bugs, please report
                            them {' '}
                            <a href={githubIssuesLInk} target='_blank' rel='noreferrer'>here</a>
                        </p>
                    </div>

                    <div className='button-row'>
                        <Button buttonType='primary' onClick={() => exportActivityFeedToCSV(roundData)}>
                            <p>Export Activity Feeds</p>
                        </Button>

                        <Button buttonType='secondary' onClick={toggleViewRaw}>
                            { viewRaw ? (
                                <p>Hide Raw</p>
                            ) : (
                                <p>View Raw</p>
                            )}
                        </Button>
                    </div>

                    <div className='view-raw'>
                        {viewRaw && (
                            <pre>
                                {JSON.stringify(roundData, null, 2)}
                            </pre>
                        )}
                    </div>
                </>
            }
        </Wrapper>
    );
};