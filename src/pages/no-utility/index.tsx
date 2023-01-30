/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Layer } from '../../components';
import { useNavigate } from 'react-router';

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
    const navigate = useNavigate();

    const setUtilityLocation = useCallback((file: FileWithPath | undefined) => {
        console.log('setting location to:', file?.path ?? 'no-path-found');
        window.localStorage.setItem('r6-dissect-location', (file as any)?.path ?? 'no-path-found');

        navigate('/home');
    }, []);  

    return (
        <Wrapper>
            <h1>Setup</h1>
            
            <Layer className='layer'>
                <h3>Replay Analyzer relies on a third-party tool called r6-dissect.</h3>
                <p>Please install the latest version & provide its install location</p>

                <div className='buttons'>
                    <Button buttonType='primary'>
                        <a href='https://github.com/redraskal/r6-dissect/releases' rel='noreferrer' target='_blank'>Install</a>
                    </Button>

                    <Button className='file-button' buttonType='secondary'>
                        <p>Select File</p>
                        <input 
                            type='file'
                            accept='.exe'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUtilityLocation(e.target.files?.[0] as FileWithPath)}
                        />
                    </Button>
                </div>
            </Layer>
        </Wrapper>
    );
};