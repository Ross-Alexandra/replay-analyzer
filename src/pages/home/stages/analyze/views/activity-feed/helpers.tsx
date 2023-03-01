import _ from 'lodash';
import { convertObjectToTable, exportDataToCSV, removeSequentialDefuseStart, removeSequentialPlantStart } from '../../helpers';

export function getActivityFeeds(rounds: Round[]): Activity[] {
    return _.chain(rounds)
        .map(({activityFeed}) => {
            return _.map(activityFeed, (feedItem) => ({...feedItem}));
        })
        .flatten()
        .value();
}

export function cleanActivityFeed(feed: Activity[]): Activity[] {
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