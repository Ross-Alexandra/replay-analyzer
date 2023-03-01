import styled from '@emotion/styled';
import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import _ from 'lodash';

import { AnalysisViewProps } from '../types';
import { exportActivityFeedTable, getActivityFeedTable } from './helpers';
import { Button } from '../../../../../../components';
import { defaultTableStyles } from '../../../../../../styles';
import * as theme from '../../../../../../theme';

const Wrapper = styled.div`
    .round-picker-text {
        text-transform: capitalize;
    }

    table {
        margin-block: 5px;
        border: 1px solid ${theme.colors.tableBorder};
    }

    ${defaultTableStyles}
`;

type ActivityFeedTableProps =
    Omit<React.HTMLProps<HTMLDivElement>, 'as'> &
    AnalysisViewProps;

function getRoundName(round: RoundWithMeta) {
    return [
        _.kebabCase(round.meta.map).replaceAll('-', ' '),
        moment(round.meta.timestamp).format('MMM Do'),
        `R${round.meta.roundNumber + 1}`
    ].join(' ');  
}

export const ActivityFeed: React.FC<ActivityFeedTableProps> = ({
    rounds,
    ...props
}) => {
    const [viewingRound, setViewingRound] = React.useState(rounds[0].meta.originalFilename);
    const viewingRoundFeed = useMemo(() => {
        const feedRound = _.chain(rounds)
            .filter(round => round.meta.originalFilename === viewingRound)
            .map(round => round.data)
            .value();
        
        return getActivityFeedTable(feedRound);
    }, [viewingRound, rounds]);

    const exportRoundFeed = useCallback(() => {
        const feedRound = rounds.filter(round => round.meta.originalFilename === viewingRound);

        exportActivityFeedTable([feedRound[0].data], getRoundName(feedRound[0]) + '.csv');
    }, [viewingRound, rounds]);

    return (
        <Wrapper {...props}>
            <div className='round-pickers'>
                {rounds.map(round => 
                    <Button
                        key={round.meta._id}
                        onClick={() => setViewingRound(round.meta.originalFilename)}
                        buttonType={round.meta.originalFilename === viewingRound ? 'primary' : 'secondary'}
                    >
                        <p className='round-picker-text'>
                            {getRoundName(round)}
                        </p>
                    </Button>    
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        {viewingRoundFeed[0].map((header, index) => 
                            <td key={index}>{_.kebabCase(header ??  '').replaceAll('-', ' ')}</td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {viewingRoundFeed.slice(1).map((row, index) =>
                        <tr key={index}>
                            {row.map((cell, index) =>
                                <td key={index}>{cell?.toString()}</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>

            <Button
                buttonType='primary'
                onClick={exportRoundFeed}
            >
                <p>Export</p>
            </Button>
        </Wrapper>
    );
};
