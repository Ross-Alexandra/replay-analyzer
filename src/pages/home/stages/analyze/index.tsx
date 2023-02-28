import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Layer } from '../../../../components';
import { cleanActivityFeed, convertObjectToTable, exportDataToCSV, getActivityFeeds } from './helpers';

const githubIssuesLInk = 'https://github.com/Ross-Alexandra/replay-analyzer/issues';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 10px;

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

interface AnalyzeProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    rounds: Round[];
}

// TODO:
//   3. Analyzes the selected rounds
//     - ( ) The user should be able to see the results of the analysis in a table
//       - ( ) The user should be able to see data about the rounds in the table
//       - ( ) The user should be able to see data about the players in the table
//       - ( ) The user should be able to see data about the teams in the table
//       - ( ) The user should be able to see data about the maps in the table
//       - ( ) The user should be able to see data about each match in the table
//       - ( ) The user should be able to see data about each round in the table
//     - ( ) The user should be able to sort the table by any column
//     - ( ) The user should be able to filter the table by any column
//     - ( ) The user should be able to filter the table by multiple columns
//     - (/) The user should be able to save the results of the analysis to a csv file 
export const Analyze: React.FC<AnalyzeProps> = ({
    className,
    rounds,
}) => {
    const [viewRaw, setViewRaw] = useState(false);
    const toggleViewRaw = useCallback(() => setViewRaw(currentViewRaw => !currentViewRaw), []);

    return (
        <Wrapper className={className}>
            <h2>Analyze Rounds</h2>
            <div className='coming-soon'>
                <p>
                    Currently the only supported utility is exporting the activity feed.
                    If you&apos;d like to see more features, or find bugs, please report
                    them {' '}
                    <a href={githubIssuesLInk} target='_blank' rel='noreferrer'>here</a>
                </p>
            </div>

            <div className='button-row'>
                <Button buttonType='primary' onClick={() => exportActivityFeedToCSV(rounds)}>
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
                        {JSON.stringify(rounds, null, 2)}
                    </pre>
                )}
            </div>
        </Wrapper>
    );
};