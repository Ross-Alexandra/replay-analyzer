import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.div`

`;

type ErrorProps = Omit<React.HTMLProps<HTMLDivElement>, 'as'>

export const Error: React.FC<ErrorProps> = ({
    ...props
}) => {
    return (
        <Wrapper {...props}>
            <h1>An unrecoverable error occurred. Please restart the application and try again.</h1>
            <p>If this error continues, please file an issue <a href='https://github.com/Ross-Alexandra/replay-analyzer/issues' target='_blank' rel='noopener noreferrer'>here</a></p>
        </Wrapper>
    );
};
