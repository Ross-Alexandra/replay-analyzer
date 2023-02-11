import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Layer } from '../../../../components';
import _ from 'lodash';

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
    const feedTable = convertObjectToTable(feed);

    exportDataToCSV(feedTable, 'activity_feed.csv');
}

function exportDataToCSV(data: unknown[][], name: string) {
    console.log(data);
    const csvContent = 'data:text/csv;charset=utf-8,'
        + data.map(e => e.join(',')).join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', name);

    link.click();
}

function convertObjectToTable(data: object[]) {
    const headerRow = _.uniqWith(_.flatten(data.map(Object.keys)), _.isEqual);
    const headerToIndex = _.zipObject(headerRow, _.range(headerRow.length));

    const rows = data.map((row) => {
        const newRow = _.fill(Array(headerRow.length), null);
        _.forEach(row, (value, key) => {
            newRow[headerToIndex[key]] = value;
        });
        return newRow;
    });

    return [headerRow, ...rows];
}

function getActivityFeeds(rounds: Round[]) {
    return _.chain(rounds)
        .map(({header, activityFeed}) => {
            return _.map(activityFeed, (feedItem) => ({roundNumber: header.roundNumber, ...feedItem}));
        })
        .flatten()
        .value();
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