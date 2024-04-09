import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

export const Spinner = styled.div`
    width: 25px;
    height: 25px;

    border: 3px solid white;
    border-bottom-color: transparent;
    border-radius: 50%;

    animation: ${spin} 1s linear infinite;
`;