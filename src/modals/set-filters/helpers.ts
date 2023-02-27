import _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import { Filter, comparators } from './types';


export function computeFilter(roundsToFilter: RoundWithMeta[], filter: Filter) {
    const comparator = comparators[filter.onField][filter.comparison];

    return roundsToFilter.filter(round => {
        const fieldValue = round.meta[filter.onField];
        const userInput = filter.value;

        if (comparator(fieldValue, userInput)) {
            return !filter.negated;
        }

        return filter.negated;
    });
}

export class FilterBuilder {
    private filter: Filter;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static fieldToDefaultValue: Record<keyof RoundMeta, any> = {
        _id: '',
        matchID: '',
        originalFilename: '',
        map: 'CLUB_HOUSE',
        tags: '',
        timestamp: new Date().toISOString().split('T')[0],
        roundNumber: 0,
    };

    private static defaultFilter: Filter = {
        _id: '',
        onField: 'map',
        comparison: 'equalTo',
        negated: false,
        value: this.fieldToDefaultValue.map,
    };

    constructor(filter?: Filter) {
        if (!filter) {
            this.filter = FilterBuilder.defaultFilter;
            this.filter._id = uuidv4();
        } else {
            this.filter = filter;
        }
    }

    getValidFields() {
        const comparatorKeys = Object.keys(comparators) as (keyof RoundMeta)[];

        // Only return fields that have at least one valid comparator
        return comparatorKeys.filter(key => !_.isEmpty(comparators[key]));
    }

    setOnField(onField: keyof RoundMeta) {
        this.filter.onField = onField;

        // Reset the other fields to acceptable values
        this.filter.comparison = this.getValidComparators()[0];
        this.filter.value = FilterBuilder.fieldToDefaultValue[onField];
        
        return this;
    }

    getValidComparators() {
        return Object.keys(comparators[this.filter.onField]);
    }

    setComparison(comparison: keyof typeof comparators[keyof RoundMeta]) {
        this.filter.comparison = comparison;
        return this;
    }

    setNegated(negated: boolean) {
        this.filter.negated = negated;
        return this;
    }

    getValidValues() {
        if (this.filter.onField === 'map') {
            return [
                'CLUB_HOUSE',
                'BORDER',
                'KANAL',
                'SKYSCRAPER',
                'TOWER',
                'CHALET',
                'BANK',
                'OREGON',
                'KAFE_DOSTOYEVSKY',
                'VILLA',
                'COASTLINE',
                'STADIUM_BRAVO'
            ];
        } else if (this.filter.onField === 'tags') {
            return null;
        } else if (this.filter.onField === 'timestamp') {
            return null;
        } else if (this.filter.onField === 'roundNumber') {
            return null;
        }
    }

    getValueInputType() {
        if (this.filter.onField === 'timestamp') {
            return 'date';
        } else if (this.filter.onField === 'roundNumber') {
            return 'number';
        } else {
            return 'text';
        }
    }

    setValue(value: Filter['value']) {
        this.filter.value = value;
        return this;
    }

    build() {
        return this.filter;
    }
}
