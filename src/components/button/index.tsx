import styled from '@emotion/styled';
import * as theme from '../../theme';

function getBackgroundColor(buttonType: ButtonType = 'no-theme') {
    switch (buttonType) {
        case 'primary':
            return theme.colors.primary;
        case 'secondary':
            return theme.colors.secondary;
        case 'no-theme':
        default:
            return theme.colors.white;
    }
}

export const Button = styled.button<ButtonProps>`
    background-color: ${({ buttonType }) => getBackgroundColor(buttonType)};
    padding: 5px 10px;

    border: 1px solid ${theme.colors.border};
    border-radius: 4px;
    
    appearance: none;
    outline: none;

    cursor: pointer;
    transition: filter 250ms;
    :hover {
        filter: brightness(1.5);
        transition: none;
    }

    :active {
        filter: brightness(0.8);
        transition: filter 250ms;
    }
`;