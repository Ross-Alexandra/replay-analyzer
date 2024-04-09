import styled from '@emotion/styled';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Tag } from '../../../../components/tag-manager/tag';
import { FilterButtons } from '../../../../components/filter-buttons';
import { useSortedRounds } from './sorting';
import { defaultTableStyles } from '../../../../styles';

const Wrapper = styled.div`
    height: 100%;
    overflow-y: auto;

    border: 1px solid #FFFFFF40;

    ${defaultTableStyles}

    tr {
        display: grid;
        
        grid-template-columns: .25fr 1.5fr 1.5fr 1.8fr 4fr;
    }

    .header-cell {
        display: flex;
        flex-direction: row;

        align-items: center;

        gap: 5px;

        svg {
            cursor: pointer;
        }
    }

    .input-cell {
        display: grid;
        place-items: center;
    }

    .tag-cell {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        align-items: center;

        gap: 5px;
    }

    .small-tag {
        height: 28px;

        font-size: 13px;
        padding: 4px 8px;
    }
`;

interface SelectTableProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    rounds: RoundWithMeta[];
    selectedRounds: string[];
    toggleRound: (round: RoundWithMeta) => void;
    selectAll: () => void;
    selectNone: () => void;
}

export const SelectTable: React.FC<SelectTableProps> = ({
    rounds,
    selectedRounds,
    toggleRound,
    selectAll,
    selectNone,
    ...props
}) => {
    const [sortedRounds, sorts, toggleSort] = useSortedRounds(rounds);

    const filteredSelectedRounds = selectedRounds.filter((roundId) => {
        return !!rounds.find((round) => round.meta._id === roundId);
    });
    return (
        <>
            <Wrapper {...props}>
                <table>
                    <thead>
                        <tr>
                            <td className='input-cell'>
                                <input
                                    type="checkbox"
                                    checked={filteredSelectedRounds.length > 0}
                                    onClick={() => {
                                        if (filteredSelectedRounds.length > 0) {
                                            selectNone();
                                            return;
                                        }

                                        selectAll();
                                    }}
                                    readOnly
                                />
                            </td>
                            <td className='header-cell'>
                                Map
                                <FilterButtons
                                    direction={sorts.map}
                                    onUpClick={() => toggleSort('map', 'asc')}
                                    onDownClick={() => toggleSort('map', 'desc')}
                                />
                            </td>
                            <td className='header-cell'>
                                Round #
                                <FilterButtons
                                    direction={sorts.roundNumber}
                                    onUpClick={() => toggleSort('roundNumber', 'asc')}
                                    onDownClick={() => toggleSort('roundNumber', 'desc')}
                                />
                            </td>
                            <td className='header-cell'>
                                Date Played
                                <FilterButtons
                                    direction={sorts.timestamp}
                                    onUpClick={() => toggleSort('timestamp', 'asc')}
                                    onDownClick={() => toggleSort('timestamp', 'desc')}
                                />
                            </td>
                            <td className='header-cell'>
                                Tags
                                <FilterButtons
                                    direction={sorts.tags}
                                    onUpClick={() => toggleSort('tags', 'asc')}
                                    onDownClick={() => toggleSort('tags', 'desc')}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRounds.map((round) => (
                            <tr 
                                key={round.meta._id}
                                className={selectedRounds.includes(round.meta._id) ? 'selected' : ''}
                                onClick={() => toggleRound(round)}                    
                            >
                                <td className='input-cell'>
                                    <input
                                        type="checkbox"
                                        checked={selectedRounds.includes(round.meta._id)}
                                        readOnly
                                    />
                                </td>
                                <td>{_.snakeCase(round.meta.map).replaceAll('_', ' ')}</td>
                                <td>Round #{round.data.roundNumber + 1}</td>
                                <td>{moment(round.meta.timestamp).format('MMM Do, YYYY')}</td>
                                <td className='tag-cell'>
                                    {round.meta.tags.map(tag => 
                                        <Tag className='small-tag' label={tag} key={tag} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Wrapper>
        </>

    );
};
