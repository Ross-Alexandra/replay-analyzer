import _ from 'lodash';

export function removeSequentialPlantStart(feed: MatchUpdate[]): MatchUpdate[] {
    return feed.reduce((acc: MatchUpdate[], feedItem: MatchUpdate, index: number) => {
        if (feedItem.type.name === 'DefuserPlantStart') {
            const previousFeedItem = feed[index - 1];
            if (previousFeedItem.type.name === 'DefuserPlantStart' && previousFeedItem.username === feedItem.username) {
                return acc;
            }
        }

        return [...acc, feedItem];
    }, []);
}

export function removeSequentialDefuseStart(feed: MatchUpdate[]): MatchUpdate[] {
    return feed.reduce((acc: MatchUpdate[], feedItem: MatchUpdate, index: number) => {
        if (feedItem.type.name === 'DefuserDisableStart') {
            const previousFeedItem = feed[index - 1];
            if (previousFeedItem.type.name === 'DefuserDisableStart' && previousFeedItem.username === feedItem.username) {
                return acc;
            }
        }

        return [...acc, feedItem];
    }, []);
}

export function convertObjectToTable(data: object[]) {
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

export function exportDataToCSV(data: unknown[][], name: string) {
    const csvContent = 'data:text/csv;charset=utf-8,'
        + data.map(e => e.join(',')).join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', name);

    link.click();
}