import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Analyze, Select, Upload } from './stages';
import { Button, Layer, Spinner } from '../../components';
import type { InputStages } from './types';
import { useAsyncResponse } from '@ross-alexandra/react-utilities';
import { useNavigate } from 'react-router';
import _ from 'lodash';
import { AnalyzeIcon, SelectIcon, UploadIcon } from '../../icons';
import { ManageRoundsModal } from '../../modals';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 10px;

    margin-top: 50px;
    height: calc(100% - 50px);
`;

const ControlsWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    height: 45px;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        padding: 5px 0px 0px 0px;

        border: none;
        border-radius: 0px;
    }

    p {
        font-size: 10px;
        opacity: 0.75;
        text-transform: uppercase;
    }
`;

type AllRoundsResponse = {rounds: RoundWithMeta[]};

export const Home = () => {
    const navigate = useNavigate();
    const [manageRoundsModalOpen, setManageRoundsModalOpen] = useState(false);

    const [stage, setStage] = useState<InputStages>('loading');
    const [roundsToAnalyze, setRoundsToAnalyze] = useState<RoundWithMeta[]>([]);
    
    const [allRounds, setAllRounds] = useState<RoundWithMeta[]>([]);
    const [asyncStatus, {rounds: roundsFromLoad}={rounds: []}] = useAsyncResponse<AllRoundsResponse>(window.api.getAllRounds);

    useEffect(() => {
        if (asyncStatus === 'error') {
            navigate('/error');
        } else if (asyncStatus === 'ready') {
            setAllRounds(roundsFromLoad);

            if (roundsFromLoad.length === 0) {
                setStage('upload');
            } else {
                setStage('select');
            }
        }
    }, [asyncStatus, roundsFromLoad]);

    useEffect(() => {
        if (allRounds.length === 0) {
            setStage('upload');
        }
    }, [allRounds]);

    const toggleRoundToAnalyze = useCallback((round: RoundWithMeta) => {
        setRoundsToAnalyze(currentRoundsToAnalyze => {
            if (_.find(currentRoundsToAnalyze, round)) {
                return currentRoundsToAnalyze.filter(currentRound => !_.isEqual(currentRound, round));
            }

            return [...currentRoundsToAnalyze, round];
        });
    }, [setRoundsToAnalyze]);

    const appendRoundToAllRounds = useCallback((round: RoundWithMeta) => {
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

    const removeRounds = useCallback(async (rounds: RoundWithMeta[]) => {
        // Drop the rounds from the list of rounds to analyze,
        // and from the list of all rounds.
        setAllRounds(currentAllRounds => 
            currentAllRounds.filter(currentRound => !_.find(rounds, currentRound))
        );
        setRoundsToAnalyze(currentRoundsToAnalyze =>
            currentRoundsToAnalyze.filter(currentRound => !_.find(rounds, currentRound))
        );
        
        // Remove the round from the file system
        await window.api.deleteRounds(rounds.map(round => round.meta._id));
    }, [setAllRounds]);

    const updateRoundTags = useCallback(async (roundIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => {
        function getUpdatedMetas(rounds: RoundWithMeta[]) {
            return rounds.map(round => {
                if (roundIds.includes(round.meta._id)) {
                    return {
                        ...round,
                        meta: {
                            ...round.meta,
                            tags: _.uniq([
                                ...round.meta.tags,
                                ...tagsToAdd
                            ]).filter(tag => !tagsToRemove.includes(tag))
                        }
                    };
                }

                return round;
            });
        }

        setAllRounds(currentAllRounds => getUpdatedMetas(currentAllRounds));
        setRoundsToAnalyze(currentRoundsToAnalyze => getUpdatedMetas(currentRoundsToAnalyze));

        const roundMetaUpdates = getUpdatedMetas(allRounds).map(round => ({
            _id: round.meta._id,
            newMeta: round.meta
        }));

        await window.api.updateRoundMetas(roundMetaUpdates);
    }, [allRounds, setAllRounds, setRoundsToAnalyze]);

    return (
        <>
            {stage !=='loading' && (
                <ControlsWrapper>
                    <Button 
                        buttonType={stage === 'upload' ? 'primary' : 'secondary'}
                        onClick={() => setStage('upload')}
                    >
                        <UploadIcon size={24} />
                        <p>Upload</p>
                    </Button>
                    <Button
                        buttonType={stage === 'select' ? 'primary' : 'secondary'}
                        disabled={allRounds.length === 0}
                        onClick={() => setStage('select')}
                    >
                        <SelectIcon size={24} />
                        <p>Select</p>
                    </Button>
                    <Button
                        buttonType={stage === 'analyze' ? 'primary' : 'secondary'}
                        disabled={roundsToAnalyze.length === 0}
                        onClick={() => setStage('analyze')}
                    >
                        <AnalyzeIcon size={24} />
                        <p>Analyze</p>
                    </Button>
                </ControlsWrapper>
            )}

            <Wrapper>
                {stage === 'loading' && (
                    <Spinner />
                )}
                
                {stage === 'upload' && (
                    <Upload
                        appendRound={appendRoundToAllRounds}
                        onFilesUploaded={() => setStage('select')}
                    />
                )}

                {stage === 'select' && (
                    <Select 
                        rounds={allRounds}
                        roundsToAnalyze={roundsToAnalyze}
                        toggleRound={toggleRoundToAnalyze}
                        openMangeRoundsModal={() => setManageRoundsModalOpen(true)}
                    />
                )}

                {stage === 'analyze' && (
                    <Analyze rounds={roundsToAnalyze.map(round => round.data)} />
                )}
            </Wrapper>

            <ManageRoundsModal 
                selectedRounds={roundsToAnalyze}
                isOpen={manageRoundsModalOpen}
                onRemoveRounds={removeRounds}
                onBackgroundClick={() => setManageRoundsModalOpen(false)}
                updateRoundTags={updateRoundTags}
            />
        </>
    );
};