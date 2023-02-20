import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';

import { Layer } from '../../../../components';
import * as theme from '../../../../theme';
import { AnalysisState } from './analysis-states';

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
        setFilesToAnalyze(previousFiles => _.uniqWith([
            ...previousFiles,
            ...files
        ], (a, b) => a.path === b.path));
    }, []);

    const [analysisState, setAnalysisState] = useState<AnalysisState>('not-started');
    const processUploadedFiles = useCallback(async () => {
        setAnalysisState('pending');
        const {response} = await window.api.analyzeFiles(filesToAnalyze.map(file => file.path));
        
        if (response.status === 'error') {
            setAnalysisState('error');
        } else {
            setRoundData(response?.data);
            setAnalysisState('success');
            setStage('analyze');
        }
    }, [setAnalysisState, setRoundData, setStage, filesToAnalyze]);

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

                    {filesToAnalyze.map(file => 
                        <p key={file.path}>
                            • {file.path.split('\\').pop()?.split('.').shift()}
                        </p>
                    )}

                    <AnalysisState
                        processUploadedFiles={processUploadedFiles}
                        analysisState={analysisState}
                    />
                </>
            }
        </Wrapper>
    );
};