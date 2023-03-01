import styled from '@emotion/styled';
import React from 'react';
import { AnalysisViewProps } from './types';

const Wrapper = styled.div`
    pre {
        color: white;
    }
`;

type RawViewProps = 
    Omit<React.HTMLProps<HTMLDivElement>, 'as'> &
    AnalysisViewProps;

export const Raw: React.FC<RawViewProps> = ({
    rounds,
    ...props
}) => {
    return (
        <Wrapper {...props}>
            <pre>
                {JSON.stringify(rounds, null, 2)}
            </pre>
        </Wrapper>
    );
};
