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

    .header {
        display: flex;
        flex-direction: row;
        gap: 10px;

        width: 100%;

        align-items: center;

        p {
            opacity: 0.75;
            font-size: 12px;
        }
    }

    .controls {
        display: flex;
        flex-direction: row;
        gap: 10px;

        margin-left: auto;
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
                <div className='header'>
                    <p>
                        {selectedRounds.length} of {rounds.length} rounds selected
                        <br />
                        {rounds.length - filteredRounds.length} rounds hidden
                    </p>

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
