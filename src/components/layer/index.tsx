import styled from '@emotion/styled';
import * as theme from '../../theme';

export const Layer = styled.div`
    background-color: ${theme.colors.layer};
    border-radius: 4px;
    padding: 10px;

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
`;