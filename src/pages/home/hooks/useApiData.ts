import { useNavigate } from 'react-router';
import { InputStages } from '../types';
import { useAsyncResponse } from '@ross-alexandra/react-utilities';
import { useEffect } from 'react';

type SetStage = React.Dispatch<React.SetStateAction<InputStages>>;
type AllRoundsResponse = {rounds: RoundWithMeta[]};

export function useApiData(
    setStage: SetStage, 
    onLoad: (roundsFromLoad: RoundWithMeta[]) => void
) {
    const navigate = useNavigate();

    const [asyncStatus, {rounds: roundsFromLoad}={rounds: []}] = useAsyncResponse<AllRoundsResponse>(window.api.getAllRounds);

    useEffect(() => {
        if (asyncStatus === 'error') {
            navigate('/error');
        } else if (asyncStatus === 'ready') {
            onLoad(roundsFromLoad);

            if (roundsFromLoad.length === 0) {
                setStage('upload');
            } else {
                setStage('select');
            }
        }
    }, [asyncStatus, roundsFromLoad]);
}