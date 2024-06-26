import React from 'react';
import { IconProps } from './type';

export const UploadIcon: React.FC<IconProps> = ({
    size=24,
    color='white',
    ...props
}) => {
    return (
        <svg width={size} height={size} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z"
                fill={color}
            />
        </svg>
    );
};
