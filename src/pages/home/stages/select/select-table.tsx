import styled from '@emotion/styled';
import React from 'react';
import * as theme from '../../../../theme';
import moment from 'moment';
import _ from 'lodash';
import { Tag } from '../../../../components/tag-manager/tag';

const Wrapper = styled.div`
    max-height: 75vh;
    overflow-y: auto;

    border: 1px solid #FFFFFF40;

    ::-webkit-scrollbar {
        width: 5px;
        background-color: #FFFFFF10;
    }

    ::-webkit-scrollbar-thumb {
        background: #000;
        background-color: ${theme.colors.background};

        border-radius: 4px;
    }
    
    scrollbar-color: #FFFFFF40 #00000000;
    scrollbar-width: thin;

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead > tr {
        font-weight: 700;
        border-bottom: 1px solid #FFFFFF40;
    }

    tbody > tr {
        cursor: pointer;
        background-color: transparent;

        transition: background-color 0.2s ease-in-out;

        :hover {
            background-color: #FFFFFF20;
            transition: none;
        }

        &.selected {
            background-color: #FFFFFF40;
            transition: none;
        }

        border-bottom: 1px solid #FFFFFF40;

        :last-of-type {
            border-bottom: none;
        }
    }

    tr {
        display: grid;
        
        grid-template-columns: .25fr 1.5fr 1.5fr 1.5fr 4fr;
    }

    td {
        padding: 5px;
        border-left: 1px solid #FFFFFF40;

        text-transform: capitalize;

        :first-of-type {
            border-left: none;
        }

        input {
            margin: 0px;
            padding: 0px;
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
    return (
        <Wrapper {...props}>
            <table>
                <thead>
                    <tr>
                        <td className='input-cell'>
                            <input
                                type="checkbox"
                                checked={selectedRounds.length > 0}
                                onClick={() => {
                                    if (selectedRounds.length > 0) {
                                        selectNone();
                                        return;
                                    }

                                    selectAll();
                                }}
                                readOnly
                            />
                        </td>
                        <td>Map</td>
                        <td>Round #</td>
                        <td>Date Played</td>
                        <td>Tags</td>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round) => (
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
                            <td>Round #{round.data.header.roundNumber + 1}</td>
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
    );
};
