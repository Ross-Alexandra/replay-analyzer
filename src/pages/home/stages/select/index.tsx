import styled from '@emotion/styled';
import React, {useCallback, useEffect} from 'react';
import _ from 'lodash';

import { Button } from '../../../../components';
import { SettingsIcon } from '../../../../icons';
import { SelectTable } from './select-table';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    
    gap: 10px;

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
    const [selectedRounds, setSelectedRounds] = React.useState<string[]>(roundsToAnalyze.map((round) => round.meta._id));
    const toggleRound = useCallback((round: RoundWithMeta) => {
        _toggleRound(round);

        setSelectedRounds((prev) => {
            if (prev.includes(round.meta._id)) {
                return prev.filter((id) => id !== round.meta._id);
            }

            return [...prev, round.meta._id];
        });
    }, [_toggleRound, setSelectedRounds]);

    const selectAll = useCallback(() => {
        const roundsToSelect = _.differenceWith(rounds, selectedRounds, (round, id) => round.meta._id === id);

        roundsToSelect.forEach((round) => toggleRound(round));
    }, [rounds, selectedRounds, toggleRound]);

    const selectNone = useCallback(() => {
        const roundsToDeselect = _.intersectionWith(rounds, selectedRounds, (round, id) => round.meta._id === id);

        roundsToDeselect.forEach((round) => toggleRound(round));
    }, [rounds, selectedRounds, toggleRound]);

    // Whenever rounds are removed from the rounds array, remove them from the selectedRounds array
    useEffect(() => {

        setSelectedRounds((prev) => {
            const roundsToRemove = _.differenceWith(prev, rounds, (id, round) => id === round.meta._id);

            return _.difference(prev, roundsToRemove);
        });
    }, [rounds, setSelectedRounds]);

    return (
        <Wrapper {...props}>
            <Button
                buttonType='primary'
                disabled={selectedRounds.length === 0}
                onClick={openMangeRoundsModal}
            >
                <SettingsIcon size={17} />
                <p>Manage Rounds</p>
            </Button>

            <SelectTable 
                rounds={rounds}
                selectedRounds={selectedRounds}
                toggleRound={toggleRound}
                selectAll={selectAll}
                selectNone={selectNone}
            />
        </Wrapper>        
    );
};
