import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Layer, Spinner } from '../../../../components';
import * as theme from '../../../../theme';

const Wrapper = styled(Layer)`
    display: flex;
    flex-direction: column;

    gap: 10px;
    padding: 10px;

    button {
        align-self: flex-start;
    }

    .drag-drop {
        position: relative;
        display: grid;
        place-items: center;
        border: 1px dashed ${theme.colors.white};

        height: 150px;

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
`;

export const Upload: React.FC<UploadProps> = ({
    className,
    currentStage,
    setStage,
    setRoundData
}) => {
    const [filesToAnalyze, setFilesToAnalyze] = useState<FileWithPath[]>([]);
    const appendFiles = useCallback((files: FileWithPath[]) => {
        setFilesToAnalyze(previousFiles => [
            ...previousFiles,
            ...files
        ]);
    }, []);

    const utilityLocation = window.localStorage.getItem('r6-dissect-location');
    const [analyzing, setAnalyzing] = useState(false);
    const processUploadedFiles = useCallback(async () => {
        setAnalyzing(true);
        const {response} = await window.api.analyzeFiles(utilityLocation, filesToAnalyze.map(file => file.path));
        
        setRoundData(response);
        setAnalyzing(false);
        setStage('analyze');
    }, [setAnalyzing, setRoundData, setStage, utilityLocation, filesToAnalyze]);

    return (
        <Wrapper className={className}>
            <h2>Upload Rounds</h2>
            {currentStage === 'upload' &&
                <>
                    <div className='drag-drop'>
                        <p>Drag & Drop replay files here!</p>
                        <input
                            type='file'
                            accept='.rec'
                            name='files[]'
                            multiple={true}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => appendFiles((e.target.files ?? []) as FileWithPath[])}
                        />
                    </div>

                    {analyzing ? (
                        <Spinner />
                    ) : (
                        <Button buttonType='primary' onClick={processUploadedFiles}>
                            <p>Process</p>
                        </Button>
                    )}
                </>
            }
        </Wrapper>
    );
};