import { useCallback, useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';

import { Filter, FilterGroup } from './types';
import { computeFilterGroup } from './helpers';


export function useFilterGroups(allRounds: RoundWithMeta[], setRounds: React.Dispatch<React.SetStateAction<RoundWithMeta[]>>) {
    const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);

    useEffect(() => {
        const filteredRounds = filterGroups.reduce((filteredRounds, filterGroup) => {
            return computeFilterGroup(filteredRounds, filterGroup);
        }, allRounds);

        setRounds(filteredRounds);
    }, [allRounds, filterGroups]);

    const addFilterGroup = useCallback((filter: Filter) => {
        setFilterGroups(filterGroups => [...filterGroups, {
            _id: uuidv4(),
            filters: [filter]
        }]);
    }, [setFilterGroups]);

    const addFilterToGroup = useCallback((filterGroup: FilterGroup, filter: Filter) => {
        setFilterGroups(filterGroups => filterGroups.map(fg => fg._id === filterGroup._id ? {
            ...fg,
            filters: [...fg.filters, filter]
        } : fg));
    }, [setFilterGroups]);

    const editFilterInGroup = useCallback((filterGroup: FilterGroup, filter: Filter) => {
        setFilterGroups(filterGroups => filterGroups.map(fg => fg._id === filterGroup._id ? {
            ...fg,
            filters: fg.filters.map(f => f._id === filter._id ? filter : f)
        } : fg));
    }, [setFilterGroups]);

    const removeFilterGroup = useCallback((filterGroup: FilterGroup) => {
        setFilterGroups(filterGroups => filterGroups.filter(fg => fg._id !== filterGroup._id));
    }, [setFilterGroups]);

    const removeFilterFromGroup = useCallback((filterGroup: FilterGroup, filter: Filter) => {
        if (filterGroup.filters.length === 1) {
            removeFilterGroup(filterGroup);
            return;
        }

        setFilterGroups(filterGroups => filterGroups.map(fg => fg._id === filterGroup._id ? {
            ...fg,
            filters: fg.filters.filter(f => f._id !== filter._id)
        } : fg));
    }, [removeFilterGroup, setFilterGroups]);

    return [filterGroups, addFilterGroup, addFilterToGroup, editFilterInGroup, removeFilterFromGroup] as const;
}