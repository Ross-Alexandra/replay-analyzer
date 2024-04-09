import _ from 'lodash';
import moment from 'moment';
import {useState, useMemo, useCallback} from 'react';

export type SortType = 'none' | 'asc' | 'desc';
export const DEFAULT_SORTS = {
    map: 'none' as SortType,
    roundNumber: 'none' as SortType,
    timestamp: 'none' as SortType,
    tags: 'none' as SortType,
};

export type Sorts = typeof DEFAULT_SORTS;

export type SortingFunction = (a: RoundWithMeta, b: RoundWithMeta, direction: SortType) => number;
export const defaultSortExceptions: Partial<Record<keyof Sorts, SortingFunction>> = {
    timestamp: (a: RoundWithMeta, b: RoundWithMeta, direction: SortType) => {
        const aTimestamp = a.meta.timestamp;
        const bTimestamp = b.meta.timestamp;
        
        const momentA = moment(aTimestamp);
        const momentB = moment(bTimestamp);

        const aDate = momentA.date();
        const bDate = momentB.date();

        const aYear = momentA.year();
        const bYear = momentB.year();

        if (aYear !== bYear) {
            return (direction === 'desc' ? -1 : 1) * (aYear - bYear);
        }

        if (aDate !== bDate) {
            return (direction === 'desc' ? -1 : 1) * (aDate - bDate);
        }

        return 0;
    }
};

export function useSortedRounds(rounds: RoundWithMeta[]) {
    const [sorts, setSorts] = useState<Sorts>(DEFAULT_SORTS);
    const sortedRounds = useMemo(() => {
        let sorted = [...rounds];

        _.toPairs(sorts).forEach(([key, direction]) => {
            if (direction === 'none') {
                return;
            }

            if (Object.keys(defaultSortExceptions).includes(key)) {
                const sortKey = key as keyof Sorts;
                sorted = sorted.sort((roundA, roundB) => defaultSortExceptions[sortKey]?.(roundA, roundB, direction) ?? 0);
            } else {
                sorted = _.orderBy(sorted, 'meta.' + key, direction);
            }
        });

        return sorted;
    }, [rounds, sorts]);
    
    const toggleSort = useCallback((key: keyof Sorts, direction: SortType) => {
        setSorts((prev) => {
            if (prev[key] === direction) {
                return {
                    ...prev,
                    [key]: 'none',
                };
            } else {
                return {
                    ...prev,
                    [key]: direction,
                };
            }
        });
    }, [setSorts]);

    return [sortedRounds, sorts, toggleSort] as const;
}