import React, { useState } from 'react';
import styled from '@emotion/styled';

import * as views from './views';
import { Button, Layer } from '../../../../components';
import _ from 'lodash';

type ViewName = keyof typeof views;
const VIEW_NAMES = Object.keys(views) as ViewName[];

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;
    gap: 10px;

    height: 100%;

    .tabs {
        .tab-text {
            text-transform: capitalize;
        }
    }

    .view {
        max-height: 100%;
        height: 100%;
        overflow: auto;
    }
`;

interface AnalyzeProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    rounds: RoundWithMeta[];
}

// TODO:
//   3. Analyzes the selected rounds
//     - (/) The user should be able to see the results of the analysis in a table
//       - (/) The user should be able to see data about each round in the table
//       - (/) The user should be able to see data about the players in the table
//       - ( ) The user should be able to see data about the teams in the table
//       - ( ) The user should be able to see data about the maps in the table
//       - ( ) The user should be able to see data about each match in the table
//     - ( ) The user should be able to sort the table by any column
//     - ( ) The user should be able to filter the table by any column
//     - (/) The user should be able to save the results of the analysis to a csv file 
export const Analyze: React.FC<AnalyzeProps> = ({
    className,
    rounds,
}) => {
    const [currentView, setCurrentView] = useState<ViewName>('ActivityFeed');

    return (
        <Wrapper className={className}>
            <h2>Analyze Rounds</h2>
            <div className='tabs'>
                {VIEW_NAMES.map((viewName) => 
                    <Button
                        key={viewName}
                        onClick={() => setCurrentView(viewName)}
                        buttonType={currentView === viewName ? 'primary' : 'secondary'}
                    >
                        <p className='tab-text'>{_.kebabCase(viewName).replaceAll('-', ' ')}</p>
                    </Button>
                )}
            </div>

            <div className='view'>
                {React.createElement(views[currentView], { rounds })}
            </div>
        </Wrapper>
    );
};