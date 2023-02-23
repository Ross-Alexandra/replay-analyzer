import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.div`

`;

interface SelectProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    rounds: RoundWithMeta[];
    toggleRound: (round: Round) => void;
}

export const Select: React.FC<SelectProps> = ({
    rounds,
    ...props
}) => {
    return (
        <Wrapper {...props}>
            <ul>
                {rounds.map((round) => (
                    <li key={round.meta._id}>{round.meta.map} - {round.meta.timestamp}</li>
                ))}
            </ul>
        </Wrapper>
    );
};
