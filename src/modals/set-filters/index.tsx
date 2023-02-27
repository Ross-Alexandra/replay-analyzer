import styled from '@emotion/styled';
import { Modal, ModalFrame, ModalProps } from '@ross-alexandra/react-utilities';
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { BaseModalWithFrameStyles } from '../styles';
import { Button } from '../../components';
import { FilterBuilder, computeFilterGroup } from './helpers';
import { Filter, FilterGroup } from './types';
import { FilterInput } from './filter-input';

const Wrapper = styled(Modal)`
    ${BaseModalWithFrameStyles}

    .modal {
        width: 80vw;
        max-height: 80vh;
    }

    .modal-frame {
        display: flex;
        flex-direction: column;

        gap: 10px;

        button {
            align-self: flex-start;
        }
    }

    .add-sub-filter {
        margin-left: 25px;
    }
`;

interface SetFiltersModalProps extends
    Omit<React.HTMLProps<HTMLDivElement>, 'as'>,
    ModalProps {
    allRounds: RoundWithMeta[];
    setRounds: React.Dispatch<React.SetStateAction<RoundWithMeta[]>>;

    // Update onBackgroundClick to be a
    // required prop
    onBackgroundClick: () => void;
}

export const SetFiltersModal: React.FC<SetFiltersModalProps> = ({
    allRounds,
    setRounds,
    ...props
}) => {
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
        console.log('editing filter', filter._id, 'in group', filterGroup._id);

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

    return (
        <Wrapper {...props}>
            <ModalFrame
                className='modal-frame'
                closeButtonColor='white'
                handleClose={props.onBackgroundClick}
            >
                <h2>Set Filters</h2>
                {filterGroups.map((filterGroup) => (
                    <>
                        {filterGroup.filters.map((filter, index) => (
                            <FilterInput
                                key={filterGroup._id + filter._id}
                                subFilter={index > 0}
                                filterBuilder={new FilterBuilder(filter)}
                                onFilterChange={(updatedFilter) => editFilterInGroup(filterGroup, updatedFilter)}
                                onRemoveFilter={() => removeFilterFromGroup(filterGroup, filter)}
                            />
                        ))}
                        <Button
                            key={filterGroup._id + 'add-sub-filter'}
                            buttonType='secondary'
                            className='add-sub-filter'
                            onClick={() => {
                                addFilterToGroup(filterGroup, new FilterBuilder().build());
                            }}
                        >
                            <p>or</p>
                        </Button>
                    </>
                ))}
                <Button
                    buttonType='primary'
                    onClick={() => {
                        addFilterGroup(new FilterBuilder().build());
                    }}
                >
                    <p>and</p>
                </Button>
            </ModalFrame>
        </Wrapper>
    );
};
