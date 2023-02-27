import _ from 'lodash';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComparisonFunction = (fieldValue: any, userInput: any) => boolean;
export const comparators: Record<keyof RoundMeta, Record<string, ComparisonFunction>> = {
    _id: {},
    map: {
        equalTo: _.eq,
    },
    matchID: {},
    originalFilename: {},
    roundNumber: {
        equalTo: (fieldValue: number, userInput: number) => _.eq(fieldValue, userInput - 1),
        greaterThan: (fieldValue: number, userInput: number) => _.gt(fieldValue, userInput - 1),
        lessThen: (fieldValue: number, userInput: number) => _.lt(fieldValue, userInput - 1),
    },
    tags : {
        startsWith: (fieldValue: string[], userInput: string) => _.some(fieldValue, tag => _.startsWith(tag, userInput)),
        equalTo: (fieldValue: string[], userInput: string) => _.some(fieldValue, tag => _.eq(tag, userInput)),
    },
    timestamp: {
        after: (fieldValue: string, userInput: string) => moment(fieldValue).isAfter(moment(userInput)),
        before: (fieldValue: string, userInput: string) => moment(fieldValue).isBefore(moment(userInput)),
        equalTo: (fieldValue: string, userInput: string) => moment(fieldValue).isSame(moment(userInput)),
    },
};

export type Filter = {
    _id: string;
    onField: keyof RoundMeta;
    comparison: keyof typeof comparators[keyof RoundMeta];
    negated: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}