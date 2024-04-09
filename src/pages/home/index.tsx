import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Analyze, Select, Upload } from './stages';
import { Button, Layer, Spinner } from '../../components';
import type { InputStages } from './types';
import { AnalyzeIcon, SelectIcon, UploadIcon } from '../../icons';
import { ManageRoundsModal } from '../../modals';
import { useRounds } from './hooks/useAllRounds';
import { useRoundsToAnalyze } from './hooks/useRoundsToAnalyze';

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


export const Home = () => {
    const [stage, setStage] = useState<InputStages>('loading');
    const {
        allRounds,
        appendRound,
        removeRounds,
        updateRoundTags,
    } = useRounds(setStage);

    const [roundsToAnalyze, toggleRound] = useRoundsToAnalyze(allRounds);
    const [manageRoundsModalOpen, setManageRoundsModalOpen] = useState(false);

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
                        appendRound={appendRound}
                        onFilesUploaded={() => setStage('select')}
                    />
                )}

                {stage === 'select' && (
                    <Select 
                        rounds={allRounds}
                        roundsToAnalyze={roundsToAnalyze}
                        toggleRound={toggleRound}
                        openMangeRoundsModal={() => setManageRoundsModalOpen(true)}
                    />
                )}

                {stage === 'analyze' && (
                    <Analyze rounds={roundsToAnalyze} />
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