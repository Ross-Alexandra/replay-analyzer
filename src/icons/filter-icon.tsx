import React from 'react';
import { IconProps } from './type';

export const FilterIcon: React.FC<IconProps> = ({
    size=24,
    color='white',
    ...props
}) => {
    return (
        <svg width={size} height={size} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path 
                d="M1 0h22l-9 14.094v9.906l-4-2v-7.906z" 
                fill={color}
            />
        </svg>
    );
};
