import styled from '@emotion/styled';
import React, {useState} from 'react';

import { Button } from '../../../../components';
import { FilterIcon, SettingsIcon } from '../../../../icons';
import { SelectTable } from './select-table';
import { useToggleable } from './useToggleable';
import { SetFiltersModal } from '../../../../modals/set-filters';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    
    gap: 10px;

    .controls {
        display: flex;
        flex-direction: row;
        gap: 10px;

        align-self: end;
        align-items: center;
    }

    button {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-self: end;

        align-items: center;
    }
`;

interface SelectProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    rounds: RoundWithMeta[];
    roundsToAnalyze: RoundWithMeta[];
    toggleRound: (round: RoundWithMeta) => void;
    openMangeRoundsModal: () => void;
}

// TODO:
//   2. Selects a set of rounds to analyze
//     - (/) The user should be able to select from a list of previously uploaded rounds
//     - (/) The user should be able to select multiple previously uploaded rounds
//     - (/) The user should be able to select & deselect all previously uploaded rounds
//     - (/) The user should be able to select & deselect individual previously uploaded rounds
//
//     - (/) The user should be able to sort the list of previously uploaded rounds by any column

//     - ( ) The user should be able to filter the list of previously uploaded rounds by tag(s)
//     - ( ) The user should be able to filter the list of previously uploaded rounds by date
//     - ( ) The user should be able to filter the list of previously uploaded rounds by map
//     - ( ) The user should be able to select & deselect all previously uploaded rounds that match the filters
//
//     - (/) The user should be able to manage which tags are applied to the selected rounds
//
//     - (/) The user should be able to remove previously uploaded rounds
export const Select: React.FC<SelectProps> = ({
    rounds,
    roundsToAnalyze,
    toggleRound: _toggleRound,
    openMangeRoundsModal,
    ...props
}) => {
    const [filteredRounds, setFilteredRounds] = useState<RoundWithMeta[]>([]);
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const {
        selectedRounds,
        toggleRound,
        selectAll,
        selectNone,
    } = useToggleable(filteredRounds, roundsToAnalyze, _toggleRound);

    return (
        <>
            <Wrapper {...props}>
                <div className="controls">
                    <Button
                        buttonType='primary'
                        onClick={() => setFilterModalOpen(true)}
                    >
                        <FilterIcon size={15} />
                        <p>Filters</p>
                    </Button>
                    <Button
                        buttonType='primary'
                        disabled={selectedRounds.length === 0}
                        onClick={openMangeRoundsModal}
                    >
                        <SettingsIcon size={17} />
                        <p>Manage Rounds</p>
                    </Button>
                </div>

                <SelectTable 
                    rounds={filteredRounds}
                    selectedRounds={selectedRounds}
                    toggleRound={toggleRound}
                    selectAll={selectAll}
                    selectNone={selectNone}
                />
            </Wrapper>        

            <SetFiltersModal
                isOpen={filterModalOpen}
                onBackgroundClick={() => setFilterModalOpen(false)}
                allRounds={rounds}
                setRounds={setFilteredRounds}
            />
        </>
    );
};
