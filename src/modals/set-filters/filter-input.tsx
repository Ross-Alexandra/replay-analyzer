import styled from '@emotion/styled';
import React, {useCallback, useMemo} from 'react';

import { FilterBuilder } from './helpers';
import { Filter } from './types';
import { DeleteIcon } from '../../icons';
import { Input } from '../../components';
import * as theme from '../../theme';

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 35px minmax(0px, 1fr) minmax(0px, .5fr) minmax(0px, 1fr) minmax(0px, 1fr) 27px;

    gap: 7px;

    select {
        background-color: ${theme.colors.background};
        color: white;
        border: none;
        outline: none;

        border-bottom: 1px solid ${theme.colors.border};
    }

    svg {
        cursor: pointer;
    }
`;

interface FilterProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    filterBuilder: FilterBuilder;
    subFilter?: boolean;
    onFilterChange: (filter: Filter) => void;
    onRemoveFilter: () => void;
}

export const FilterInput: React.FC<FilterProps> = ({
    filterBuilder,
    subFilter,
    onFilterChange,
    onRemoveFilter,
    ...props
}) => {
    const validFieldValues = useMemo(() => filterBuilder.getValidValues(), [filterBuilder]);
    const currentFilter = useMemo(() => filterBuilder.build(), [filterBuilder]);

    const onFieldChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newOnField = event.target.value as keyof RoundMeta;

        filterBuilder.setOnField(newOnField);
        onFilterChange(filterBuilder.build());
    }, [filterBuilder, onFilterChange]);

    const onNegatedChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newNegated = event.target.value === 'is not';

        filterBuilder.setNegated(newNegated);
        onFilterChange(filterBuilder.build());
    }, [filterBuilder, onFilterChange]);

    const onComparatorChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newComparator = event.target.value;

        filterBuilder.setComparison(newComparator);
        onFilterChange(filterBuilder.build());
    }, [filterBuilder, onFilterChange]);

    const onValueChange = useCallback((event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        filterBuilder.setValue(newValue);
        onFilterChange(filterBuilder.build());
    }, [filterBuilder, onFilterChange]);

    return (
        <Wrapper {...props}>
            <p>{subFilter ? '...or' : 'Filter'}</p>
            <select
                value={currentFilter.onField}
                onChange={onFieldChange}
            >
                {filterBuilder.getValidFields().map((field) =>
                    <option key={field} value={field}>{field}</option>
                )}
            </select>
            <select
                value={currentFilter.negated ? 'is not' : 'is'}
                onChange={onNegatedChange}
            >
                <option value='is'>is</option>
                <option value='is not'>is not</option>
            </select>
            <select
                value={currentFilter.comparison}
                onChange={onComparatorChange}
            >
                {filterBuilder.getValidComparators().map((comparatorName) =>
                    <option key={comparatorName} value={comparatorName}>{comparatorName}</option>
                )}
            </select>
            {validFieldValues ? (
                <select
                    value={currentFilter.value}
                    onChange={onValueChange}
                >
                    {validFieldValues.map((value) =>
                        <option key={value} value={value}>{value}</option>
                    )}
                </select>
            ) : (
                <Input 
                    type={filterBuilder.getValueInputType()}
                    value={currentFilter.value}
                    onChange={onValueChange}
                />
            )}
            <DeleteIcon
                size={27}
                onClick={onRemoveFilter}
            />
        </Wrapper>
    );
};
