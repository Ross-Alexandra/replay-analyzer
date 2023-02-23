import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Analyze, Select, Upload } from './stages';
import { Button, Layer, Spinner } from '../../components';
import type { InputStages } from './types';
import { useAsyncResponse } from '@ross-alexandra/react-utilities';
import { useNavigate } from 'react-router';
import _ from 'lodash';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

type AllRoundsResponse = {rounds: RoundWithMeta[]};

export const Home = () => {
    const navigate = useNavigate();

    const [stage, setStage] = useState<InputStages>('loading');
    const [roundsToAnalyze, setRoundsToAnalyze] = useState<Round[]>([]);
    
    const [allRounds, setAllRounds] = useState<RoundWithMeta[]>([]);
    const [asyncStatus, {rounds: roundsFromLoad}={rounds: []}] = useAsyncResponse<AllRoundsResponse>(window.api.getAllRounds);

    useEffect(() => {
        if (asyncStatus === 'error') {
            navigate('/error');
        } else if (asyncStatus === 'ready') {
            setStage('select');
            setAllRounds(roundsFromLoad);
        }
    }, [asyncStatus, roundsFromLoad]);

    const toggleRoundToAnalyze = useCallback((round: Round) => {
        setRoundsToAnalyze(currentRoundsToAnalyze => {
            if (_.find(currentRoundsToAnalyze, round)) {
                return currentRoundsToAnalyze.filter(currentRound => !_.isEqual(currentRound, round));
            }

            return [...currentRoundsToAnalyze, round];
        });
    }, []);

    const appendRoundToAllRounds = useCallback((round: RoundWithMeta) => {
        setAllRounds(currentAllRounds => [...currentAllRounds, round]);
    }, []);

    // TODO: Rewrite this so that a user:
    //   1. Optionally Uploads rounds for later analysis
    //     - The user should be able to upload new rounds
    //     - The user should be able to upload new rounds and tag them with custom tag(s)
    //
    //   2. Selects a set of rounds to analyze
    //     - The user should be able to select from a list of previously uploaded rounds
    //     - The user should be able to select multiple previously uploaded rounds
    //     - The user should be able to select & deselect all previously uploaded rounds
    //     - The user should be able to select & deselect individual previously uploaded rounds
    //
    //     - The user should be able to filter the list of previously uploaded rounds by tag(s)
    //     - The user should be able to filter the list of previously uploaded rounds by date
    //     - The user should be able to filter the list of previously uploaded rounds by map
    //     - The user should be able to select & deselect all previously uploaded rounds that match the filters
    //
    //     - The user should be able to manage which tags are applied to the selected rounds
    //
    //     - The user should be able to remove previously uploaded rounds
    //
    //   3. Analyzes the selected rounds
    //     - The user should be able to see the results of the analysis in a table
    //       - The user should be able to see data about the rounds in the table
    //       - The user should be able to see data about the players in the table
    //       - The user should be able to see data about the teams in the table
    //       - The user should be able to see data about the maps in the table
    //       - The user should be able to see data about each match in the table
    //       - The user should be able to see data about each round in the table
    //     - The user should be able to sort the table by any column
    //     - The user should be able to filter the table by any column
    //     - The user should be able to filter the table by multiple columns
    //     - The user should be able to save the results of the analysis to a csv file 
    return (
        <Wrapper>
            {stage === 'loading' && (
                <Spinner />
            )}
            
            {stage === 'upload' && (
                <Upload 
                    appendRound={appendRoundToAllRounds}
                />
            )}

            {stage === 'select' && (
                <Select 
                    rounds={allRounds}
                    toggleRound={toggleRoundToAnalyze} 
                />
            )}

            {stage === 'analyze' && (
                <Analyze rounds={roundsToAnalyze} />
            )}

            {stage !=='loading' && (
                <div className='button-row'>
                    <p>Todo: Make me look better</p>
                    <Button onClick={() => setStage('upload')}>Upload</Button>
                    <Button onClick={() => setStage('select')}>Select</Button>
                    <Button onClick={() => setStage('analyze')}>Analyze</Button>
                </div>
            )}
        </Wrapper>
    );
};