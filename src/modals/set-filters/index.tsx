import styled from '@emotion/styled';
import { Modal, ModalFrame, ModalProps } from '@ross-alexandra/react-utilities';
import React from 'react';

import * as theme from '../../theme';
import { BaseModalWithFrameStyles } from '../styles';
import { Button } from '../../components';
import { FilterBuilder } from './helpers';
import { FilterInput } from './filter-input';
import { useFilterGroups } from './useFilterGroups';

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

    .filter-group {
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        gap: 10px;

        border-bottom: 1px solid ${theme.colors.text}44;
    }

    .sub-filter,
    .add-sub-filter-container {
        margin-left: 25px;
    }

    .add-sub-filter-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
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
    const [
        filterGroups,
        addFilterGroup,
        addFilterToGroup,
        editFilterInGroup,
        removeFilterFromGroup
    ] = useFilterGroups(allRounds, setRounds);

    return (
        <Wrapper {...props}>
            <ModalFrame
                className='modal-frame'
                closeButtonColor='white'
                handleClose={props.onBackgroundClick}
            >
                <h2>Filters</h2>
                {filterGroups.map((filterGroup) => (
                    <div className='filter-group' key={filterGroup._id}>
                        {filterGroup.filters.map((filter, index) => (
                            <FilterInput
                                key={filterGroup._id + filter._id}
                                className={index > 0 ? 'sub-filter' : ''}
                                subFilter={index > 0}
                                filterBuilder={new FilterBuilder(filter)}
                                onFilterChange={(updatedFilter) => editFilterInGroup(filterGroup, updatedFilter)}
                                onRemoveFilter={() => removeFilterFromGroup(filterGroup, filter)}
                            />
                        ))}
                        <div className='add-sub-filter-container'>
                            <p>...or</p>
                            <Button
                                buttonType='secondary'
                                onClick={() => {
                                    addFilterToGroup(filterGroup, new FilterBuilder().build());
                                }}
                            >
                                <p>Add Alternate Filter</p>
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    buttonType='primary'
                    onClick={() => {
                        addFilterGroup(new FilterBuilder().build());
                    }}
                >
                    <p>New Filter</p>
                </Button>
            </ModalFrame>
        </Wrapper>
    );
};
