import React from 'react';
import styled from '@emotion/styled';
import { Layer } from '../../../../components';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 5x;

    .export {
        align-self: flex-start;
    }

    .help-text {
        margin-top: 15px;
        font-size: 12px;
    }
`;

export const Analyze: React.FC<AnalyzeProps> = ({
    className,
    currentStage,
    roundData,
}) => {
    return (
        <Wrapper className={className}>
            <h2>Analyze Rounds</h2>
            {currentStage === 'analyze' &&
                <>
                    <pre>
                        {JSON.stringify(roundData, null, 2)}
                    </pre>
                </>
            }
        </Wrapper>
    );
};