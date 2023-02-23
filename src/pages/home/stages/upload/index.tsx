import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import * as theme from '../../../../theme';
import { Button, Spinner } from '../../../../components';

const Wrapper = styled.div`
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

    li 
`;

interface UploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    appendRound: (round: RoundWithMeta) => void;
}

export const Upload: React.FC<UploadProps> = ({
    appendRound,
    ...props
}) => {
    const [files, setFiles] = React.useState<FileWithPath[]>([]);
    const [saving, setSaving] = React.useState<boolean>(false);

    const appendFiles = useCallback((newFiles: FileWithPath[]) => {
        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const saveFiles = useCallback(async () => {
        setSaving(true);
        const filePaths = files.map((file) => file.path);

        const {meta: parsedRounds}: {meta: RoundWithMeta[]} = await window.api.uploadRounds(filePaths, []);
        
        parsedRounds.forEach((round) => appendRound(round));

        setFiles([]);
        setSaving(false);
    }, [files]);

    return (
        <Wrapper {...props}>
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

            <h3>Files to upload:</h3>
            <ul>
                {files.map((file) => (
                    <li key={file.path}>{file.path.split('\\').pop()?.split('.').shift()}</li>
                ))}
            </ul>

            {saving ? (
                <>
                    <Spinner />
                    <p>This may take a while...</p>
                </>
            ) : (
                <Button onClick={saveFiles}>Save Files</Button>
            )}
        </Wrapper>
    );
};
