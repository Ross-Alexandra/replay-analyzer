import styled from '@emotion/styled';
import React, { useCallback, useEffect } from 'react';
import * as theme from '../../../../theme';
import { Button, Spinner } from '../../../../components';
import _ from 'lodash';
import { SetTags } from '../../../../modals/set-tags';

const Wrapper = styled.div`
    height: 100%;
    overflow: auto;

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

    ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-block: 5px;

        overflow-y: auto;
    }
`;

interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    appendRound: (round: RoundWithMeta) => void;
    onFilesUploaded: () => void;
}

// Todo:
//  1. ( ) Each round should have a badge beside it indicating that it has
//         successfully been uploaded.
export const Upload: React.FC<UploadProps> = ({
    appendRound,
    onFilesUploaded,
    ...props
}) => {
    const [files, setFiles] = React.useState<FileWithPath[]>([]);
    const [saving, setSaving] = React.useState<boolean>(false);
    const [estimatedSavingTime, setEstimatedSavingTime] = React.useState<number>(0);

    const [tags, setTags] = React.useState<string[]>([]);
    const [showSetTagsModal, setShowSetTagsModal] = React.useState<boolean>(false);

    const addTag = useCallback((tag: string) => {
        setTags((prev) => [...prev, _.kebabCase(tag)]);
    }, []);

    const removeTag = useCallback((tag: string) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    }, []);

    const appendFiles = useCallback((newFiles: FileWithPath[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const saveFiles = useCallback(async () => {
        setSaving(true);
        const filePaths = files.map((file) => file.path);

        const {meta: parsedRounds}: {meta: RoundWithMeta[]} = await window.api.uploadRounds(filePaths, tags);
        
        parsedRounds.forEach((round) => appendRound(round));

        setFiles([]);
        setSaving(false);

        onFilesUploaded();
    }, [files, tags, appendRound, onFilesUploaded, setSaving, setFiles]);

    const startSavingCountdown = useCallback(() => {
        setEstimatedSavingTime(Math.ceil(files.length * 1.5));

        const interval = setInterval(() => {
            setEstimatedSavingTime((prev) => prev - 1);

            if (estimatedSavingTime < 0) {
                clearInterval(interval);
            }
        }, 1000);
    }, [files, setEstimatedSavingTime]);

    useEffect(() => {
        if (saving && estimatedSavingTime >= 0) {
            document.getElementById('saving-spinner')?.scrollIntoView({behavior: 'smooth'});
        } else if (saving && estimatedSavingTime === -1) {
            document.getElementById('saving-spinner')?.scrollIntoView({behavior: 'smooth'});
        }

    }, [estimatedSavingTime, saving]);

    return (
        <>
            <Wrapper {...props}>
                <h1>Upload Files</h1>
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

                <ul>
                    {files.map((file) => (
                        <li key={file.path}>{file.path.split('\\').pop()?.split('.').shift()}</li>
                    ))}
                </ul>

                {saving ? (
                    <>
                        {estimatedSavingTime >= -1 && <p>Estimated Time to completion: {estimatedSavingTime}s</p>}
                        {estimatedSavingTime === -1 && <p>This is taking longer than expected...</p>}
                        <Spinner 
                            id='saving-spinner'
                        />
                    </>
                ) : (
                    <>
                        <Button 
                            buttonType='primary'
                            disabled={files.length === 0}
                            onClick={() => {
                                setShowSetTagsModal(true);
                            }}
                        >
                            <p>Set Tags</p>
                        </Button>
                        <Button 
                            buttonType='primary'
                            disabled={files.length === 0}
                            onClick={() => {
                                startSavingCountdown();
                                saveFiles();
                            }}
                        >
                            <p>Save Files</p>
                        </Button>
                    </>
                )}
            </Wrapper>

            <SetTags 
                isOpen={showSetTagsModal}
                onBackgroundClick={() => setShowSetTagsModal(false)}
                tags={tags}
                addTag={addTag}
                removeTag={removeTag}
            />
        </>
    );
};
