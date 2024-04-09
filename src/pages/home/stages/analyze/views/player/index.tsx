import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import _ from 'lodash';

import { AnalysisViewProps } from '../types';
import { getPlayerStatistics } from './helpers';
import { convertObjectToTable, exportDataToCSV } from '../../helpers';
import { defaultTableStyles } from '../../../../../../styles';
import * as theme from '../../../../../../theme';
import { Button } from '../../../../../../components';

const Wrapper = styled.div`
    ${defaultTableStyles}

    display: flex;
    flex-direction: column;
    gap: 10px;

    table {
        border: 1px solid ${theme.colors.tableBorder};
    }

    .table-controls {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        gap: 5px;
    }

    label {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: 5px;

        input[type=number] {
            background-color: ${theme.colors.subLayer};
            border: 1px solid ${theme.colors.border};
        }
    }

    button {
        align-self: flex-start;
    }
`;

type PlayerTableProps = 
    Omit<React.HTMLProps<HTMLDivElement>, 'as'> &
    AnalysisViewProps;

export const Players: React.FC<PlayerTableProps> = ({
    rounds,
    ...props
}) => {
    const [onlyShowRecordingPlayerTeam, setOnlyShowRecordingPlayerTeam] = useState(true);

    const playerStatsByPlayer = useMemo(() => {
        const nonUniquePlayers = rounds.reduce((acc, round) => {
            const recordingPlayerId = round.data.recordingPlayerID;
            const recordingPlayerTeamIndex = _.find(round.data.players, p => p.id === recordingPlayerId)?.teamIndex ?? -1;

            const players = round.data.players.filter(p => {
                if (onlyShowRecordingPlayerTeam) {
                    return p.teamIndex === recordingPlayerTeamIndex;
                }
                return true;
            });

            return [...acc, ...players];
        }, [] as Player[]);

        const playerUsernames = _.uniq(nonUniquePlayers.map(p => p.username));

        const playerStats = playerUsernames.map(username => ({
            username,
            ...getPlayerStatistics(rounds, username)
        }));

        return _.orderBy(playerStats, 'username', 'asc');
    }, [rounds, onlyShowRecordingPlayerTeam]);

    const playerStatsTable = useMemo(() => {
        return convertObjectToTable(playerStatsByPlayer);
    }, [playerStatsByPlayer]);

    return (
        <Wrapper {...props}>
            <div className='table-controls'>
                <label>
                    <input
                        type='checkbox'
                        checked={onlyShowRecordingPlayerTeam}
                        onChange={e => setOnlyShowRecordingPlayerTeam(e.target.checked)}
                    />
                    Only recording player&apos;s team
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        {playerStatsTable[0].map((header, index) => 
                            <td key={index}>{_.kebabCase(header ??  '').replaceAll('-', ' ')}</td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {playerStatsTable.slice(1).map((row, index) =>
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
                onClick={() => {
                    exportDataToCSV(playerStatsTable, 'player-stats.csv');
                }}
            >
                <p>Export</p>
            </Button>
        </Wrapper>
    );
};
