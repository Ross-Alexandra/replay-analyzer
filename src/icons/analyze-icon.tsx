import React from 'react';
import { IconProps } from './type';

export const AnalyzeIcon: React.FC<IconProps> = ({
    size=24,
    color='white',
    ...props
}) => {
    return (
        <svg width={size} height={size} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M21.169 19.754c.522-.79.831-1.735.831-2.754 0-2.761-2.238-5-5-5s-5 2.239-5 5 2.238 5 5 5c1.019 0 1.964-.309 2.755-.832l2.831 2.832 1.414-1.414-2.831-2.832zm-4.169.246c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm-4.89 2h-7.11l2.599-3h2.696c.345 1.152.976 2.18 1.815 3zm-2.11-5h-10v-17h22v12.11c-.574-.586-1.251-1.068-2-1.425v-8.685h-18v13h8.295c-.19.634-.295 1.305-.295 2zm-4-4h-2v-6h2v6zm3 0h-2v-9h2v9zm3 0h-2v-4h2v4z" 
                fill={color}
            />
        </svg>
    );
};
