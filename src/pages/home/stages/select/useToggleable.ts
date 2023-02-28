import _ from 'lodash';
import { useCallback, useState, useEffect } from 'react';

export function useToggleable(allRounds: RoundWithMeta[], initialRounds: RoundWithMeta[], onToggle: (round: RoundWithMeta) => void) {
    const [selectedRounds, setSelectedRounds] = useState<string[]>(initialRounds.map((round) => round.meta._id));

    // Whenever rounds are removed from the rounds array, remove them from the selectedRounds array
    useEffect(() => {
        setSelectedRounds((prev) => {
            const roundsToRemove = _.differenceWith(prev, initialRounds, (id, round) => id === round.meta._id);

            return _.difference(prev, roundsToRemove);
        });
    }, [initialRounds, setSelectedRounds]);

    const toggleRound = useCallback((round: RoundWithMeta) => {
        onToggle(round);

        setSelectedRounds((prev) => {
            if (prev.includes(round.meta._id)) {
                return prev.filter((id) => id !== round.meta._id);
            }

            return [...prev, round.meta._id];
        });
    }, [onToggle, setSelectedRounds]);

    const selectAll = useCallback(() => {
        const roundsToSelect = _.differenceWith(allRounds, selectedRounds, (round, id) => round.meta._id === id);

        roundsToSelect.forEach((round) => toggleRound(round));
    }, [allRounds, selectedRounds, toggleRound]);

    const selectNone = useCallback(() => {
        const roundsToDeselect = _.intersectionWith(allRounds, selectedRounds, (round, id) => round.meta._id === id);

        roundsToDeselect.forEach((round) => toggleRound(round));
    }, [allRounds, selectedRounds, toggleRound]);

    return {
        selectedRounds,
        toggleRound,
        selectAll,
        selectNone,
    };
}