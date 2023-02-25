import { useCallback, useEffect, useState } from 'react';
import { useApiData } from './useApiData';
import { InputStages } from '../types';
import _ from 'lodash';
import { getUpdatedMetas } from './helpers';

type SetStage = React.Dispatch<React.SetStateAction<InputStages>>;

export function useRounds(setStage: SetStage) {
    const [allRounds, setAllRounds] = useState<RoundWithMeta[]>([]);

    useApiData(setStage, setAllRounds);

    useEffect(() => {
        if (allRounds.length === 0) {
            setStage('upload');
        }
    }, [allRounds]);

    const append = useCallback((round: RoundWithMeta) => {
        setAllRounds(currentAllRounds => {
            if (!_.find(currentAllRounds, {meta: {originalFilename: round.meta.originalFilename}})) {
                return [...currentAllRounds, round];
            } else {
                // Spread this so that the component re-renders
                // when the round is updated.
                return [...currentAllRounds];
            }
        });
    }, [setAllRounds]);

    const remove = useCallback(async (rounds: RoundWithMeta[]) => {
        // Drop the rounds from the list of rounds to analyze,
        // and from the list of all rounds.
        setAllRounds(currentAllRounds => 
            currentAllRounds.filter(currentRound => !_.find(rounds, currentRound))
        );
        
        // Remove the round from the file system
        await window.api.deleteRounds(rounds.map(round => round.meta._id));
    }, [setAllRounds]);

    const updateTags = useCallback(async (roundIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => {
        setAllRounds(currentAllRounds => getUpdatedMetas(currentAllRounds, roundIds, tagsToAdd, tagsToRemove));

        const roundMetaUpdates = getUpdatedMetas(allRounds, roundIds, tagsToAdd, tagsToRemove).map(round => ({
            _id: round.meta._id,
            newMeta: round.meta
        }));

        await window.api.updateRoundMetas(roundMetaUpdates);
    }, [allRounds, setAllRounds]);

    return {
        allRounds,
        appendRound: append,
        removeRounds: remove,
        updateRoundTags: updateTags
    };
}