import _ from 'lodash';
import { convertObjectToTable, exportDataToCSV, removeSequentialDefuseStart, removeSequentialPlantStart } from '../../helpers';

export function getActivityFeeds(rounds: Round[]) {
    return _.chain(rounds)
        .map(({players, matchFeedback}) => {
            return _.map(matchFeedback, (feedItem) => ({
                ...feedItem,
                type: feedItem.type.name,
                operator: players.find(player => player.username == feedItem.username)?.operator.name,
            }));
        })
        .flatten()
        .value();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanActivityFeed(feed: any[]) {
    return removeSequentialPlantStart(removeSequentialDefuseStart(feed));
}

export function getActivityFeedTable(rounds: Round[]) {
    const feed = getActivityFeeds(rounds);
    const cleanedFeeds = cleanActivityFeed(feed);
    return convertObjectToTable(cleanedFeeds);
}

export function exportActivityFeedTable(rounds: Round[], filename='activity_feed.csv') {
    const feedTable = getActivityFeedTable(rounds);

    exportDataToCSV(feedTable, filename);
}
