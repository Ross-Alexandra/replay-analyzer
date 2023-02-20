/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from '@emotion/styled';
import { Layer, Spinner } from '../../components';


const Wrapper = styled.div`
    height: 100%;

    display: flex;
    flex-direction: column;

    gap: 10px;

    .layer {
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 10px;
        padding: 10px;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: 15px;

        .file-button {
            position: relative;
            z-index: 1;
            cursor: pointer;

            input {
                position: absolute;
                inset: 0px;
                width: 100%;
                height: 100%;
    
                opacity: 0;

                cursor: pointer;

                z-index: 0;

                ::-webkit-file-upload-button {
                    cursor: pointer; 
                }
            }
        }
    }

    a {
        text-decoration: none;
    }
`;

export const NoUtility = () => {
    return (
        <Wrapper>
            <Layer className='layer'>
                <h1>Loading</h1>
                <Spinner />
            </Layer>
        </Wrapper>
    );
};