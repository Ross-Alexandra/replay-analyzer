import _ from 'lodash';

export function removeSequentialPlantStart(feed: Activity[]): Activity[] {
    return feed.reduce((acc: Activity[], feedItem: Activity, index: number) => {
        if (feedItem.type === 'DEFUSER_PLANT_START') {
            const previousFeedItem = feed[index - 1];
            if (previousFeedItem.type === 'DEFUSER_PLANT_START' && previousFeedItem.username === feedItem.username) {
                return acc;
            }
        }

        return [...acc, feedItem];
    }, []);
}

export function removeSequentialDefuseStart(feed: Activity[]): Activity[] {
    return feed.reduce((acc: Activity[], feedItem: Activity, index: number) => {
        if (feedItem.type === 'DEFUSER_DISABLE_START') {
            const previousFeedItem = feed[index - 1];
            if (previousFeedItem.type === 'DEFUSER_DISABLE_START' && previousFeedItem.username === feedItem.username) {
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