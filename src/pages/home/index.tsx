import React, { useState } from 'react';
import styled from '@emotion/styled';
import * as theme from '../../theme';
import { Analyze, Upload } from './sections';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .layer {
        &.disabled {
            position: relative;
            opacity: 0.5;

            :after {
                content: '';
                background-color: ${theme.colors.black};
                opacity: 0.5;
                
                position: absolute;
                inset: 0px;
            }
        }
    }
`;

export const Home = () => {
    const [stage, setStage] = useState<InputStages>('upload');
    const [roundData, setRoundData] = useState<Round[]>([]);

    console.log(roundData, stage);
    return (
        <Wrapper>
            <Upload
                className={`layer ${stage !== 'upload' ? 'disabled' : ''}`}
                currentStage={stage}
                setStage={setStage}
                setRoundData={setRoundData}
            />
            
            <Analyze className={`layer ${stage !== 'analyze' ? 'disabled' : ''}`} 
                currentStage={stage}
                setStage={setStage}
                roundData={roundData}
            />
        </Wrapper>
    );
};