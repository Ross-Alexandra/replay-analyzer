import { css } from '@emotion/react';
import * as theme from '../theme';

export const BaseModalWithFrameStyles = css`
    .modal {
        background-color: transparent;
    }

    .modal-frame {
        background-color: ${theme.colors.background};
        padding: 10px;

        border-radius: 4px;
    }
`;