import styled from '@emotion/styled';
import React from 'react';
import * as theme from '../../theme';

const Wrapper = styled.input`
    appearance: none;
    outline: none;

    padding: 5px 10px;

    background-color: ${theme.colors.layer};
    border: 1px solid ${theme.colors.border};
    border-radius: 4px;

    color: ${theme.colors.text};

    ::placeholder {
        color: ${theme.colors.text};
        opacity: 0.5;
    }
`;

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'as'>

export const Input: React.FC<InputProps> = ({
    ...props
}) => {
    return (
        <Wrapper {...props} />
    );
};
