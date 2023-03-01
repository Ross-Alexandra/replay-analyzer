import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export function useRoundsToAnalyze(allRounds: RoundWithMeta[]) {
    const [roundsToAnalyze, setRoundsToAnalyze] = useState<RoundWithMeta[]>([]);

    // When allRounds changes, update the
    // selected round objects to match
    // the new round objects.
    useEffect(() => {
        setRoundsToAnalyze(currentRoundsToAnalyze => {
            return currentRoundsToAnalyze.reduce((acc, roundToAnalyze) => {
                const matchingRound = _.find(allRounds, {meta: {_id: roundToAnalyze.meta._id}});

                if (matchingRound) {
                    return [...acc, matchingRound];
                }

                return acc;
            }, [] as RoundWithMeta[]);
        });
    }, [allRounds]);

    const toggle = useCallback((round: RoundWithMeta) => {
        setRoundsToAnalyze(currentRoundsToAnalyze => {
            if (_.find(currentRoundsToAnalyze, round)) {
                return currentRoundsToAnalyze.filter(currentRound => !_.isEqual(currentRound, round));
            }

            return [...currentRoundsToAnalyze, round];
        });
    }, [setRoundsToAnalyze]);

    return [roundsToAnalyze, toggle] as const;
}