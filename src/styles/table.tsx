import { css } from '@emotion/react';

import * as theme from '../theme';

export const defaultTableStyles = css`
    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead > tr {
        font-weight: 700;
        border-bottom: 1px solid ${theme.colors.tableBorder};
    }

    tbody > tr {
        cursor: pointer;
        background-color: transparent;

        transition: background-color 0.2s ease-in-out;

        :hover {
            background-color: #FFFFFF20;
            transition: none;
        }

        &.selected {
            background-color: ${theme.colors.tableBorder};
            transition: none;
        }

        border-bottom: 1px solid ${theme.colors.tableBorder};

        :last-of-type {
            border-bottom: none;
        }
    }

    td {
        padding: 5px;
        border-left: 1px solid ${theme.colors.tableBorder};

        text-transform: capitalize;

        :first-of-type {
            border-left: none;
        }

        input {
            margin: 0px;
            padding: 0px;
        }
    }
`;
