import styled from '@emotion/styled';
import React from 'react';

import * as theme from '../../theme';

const Wrapper = styled.div`
    position: relative;
    max-width: 50%;

    display: grid;
    place-items: center;
    text-align: center;
    text-transform: lowercase;

    background-color: ${theme.colors.tertiary};
    padding: 5px 8px;

    border-radius: 16px;

    p {
        width: 100%;
        color: black;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    cursor: pointer;
    &.interactive {
        :hover {
            ::after {
                content: '×';
                position: absolute;

                inset: 0px;
                border-radius: 16px;

                background-color: #00000090;
                color: white;

                display: grid;
                place-items: center;

                font-size: 30px;
            }
        }
    }
`;

interface TagProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    label: string;
}

export const Tag: React.FC<TagProps> = ({
    label,
    onClick,
    ...props
}) => {
    return (
        <Wrapper
            className={onClick ? 'interactive' : ''}
            onClick={onClick}
            {...props}
        >
            <p>{label}</p>
        </Wrapper>
    );
};
