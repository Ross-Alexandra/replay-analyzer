import styled from '@emotion/styled';
import React from 'react';
import { DownTriangle, UpTriangle } from '../../icons/';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

interface FilterButtonsProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    direction: 'asc' | 'desc' | 'none';
    onUpClick: () => void;
    onDownClick: () => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
    direction,
    onUpClick,
    onDownClick,
    ...props
}) => {
    return (
        <Wrapper {...props}>
            <UpTriangle 
                size={17}
                onClick={onUpClick}
                color={direction === 'asc' ? '#ffffffff' : '#ffffff80'}
            />
            <DownTriangle
                size={17} 
                onClick={onDownClick}
                color={direction === 'desc' ? '#ffffffff' : '#ffffff80'}
            />
        </Wrapper>
    );
};
