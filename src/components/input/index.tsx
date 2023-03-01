import styled from '@emotion/styled';
import React from 'react';
import * as theme from '../../theme';

const Wrapper = styled.input`
    appearance: none;
    outline: none;

    padding: 5px 10px;

    background-color: ${theme.colors.subLayer};
    border: 1px solid ${theme.colors.border};
    border-radius: 4px;

    color: ${theme.colors.text};

    ::placeholder {
        color: ${theme.colors.text};
        opacity: 0.5;
    }
`;

interface InputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'as'> {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
    ...props
}) => {
    return (
        <Wrapper {...props} />
    );
};
