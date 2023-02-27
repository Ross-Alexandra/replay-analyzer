import styled from '@emotion/styled';
import { Modal, ModalFrame, ModalProps } from '@ross-alexandra/react-utilities';
import React, {useState, useEffect, useCallback} from 'react';
import { BaseModalWithFrameStyles } from '../styles';

import { Button } from '../../components';
import { FilterBuilder, computeFilter } from './helpers';
import { Filter } from './types';
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
    const [filters, setFilters] = useState<Filter[]>([]);

    useEffect(() => {
        const filteredRounds = filters.reduce((filteredRounds, filter) => {
            return computeFilter(filteredRounds, filter);
        }, allRounds);

        setRounds(filteredRounds);
    }, [allRounds, filters]);

    const addFilter = useCallback((filter: Filter) => {
        setFilters(filters => [...filters, filter]);
    }, [setFilters]);

    const editFilter = useCallback((filter: Filter) => {
        setFilters(filters => filters.map(f => f._id === filter._id ? filter : f));
    }, [setFilters]);

    const removeFilter = useCallback((filter: Filter) => {
        setFilters(filters => filters.filter(f => f._id !== filter._id));
    }, [setFilters]);

    return (
        <Wrapper {...props}>
            <ModalFrame
                className='modal-frame'
                closeButtonColor='white'
                handleClose={props.onBackgroundClick}
            >
                <h2>Set Filters</h2>
                {filters.map((filter, index) => (
                    <FilterInput
                        key={index}
                        filterBuilder={new FilterBuilder(filter)}
                        onFilterChange={editFilter}
                        onRemoveFilter={() => removeFilter(filter)}
                    />
                ))}
                <Button
                    buttonType='primary'
                    onClick={() => {
                        addFilter(new FilterBuilder().build());
                    }}
                >
                    <p>Add Filter</p>
                </Button>
            </ModalFrame>
        </Wrapper>
    );
};
