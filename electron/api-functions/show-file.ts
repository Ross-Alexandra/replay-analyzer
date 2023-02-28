import { IpcMainInvokeEvent, ipcRenderer, shell } from 'electron';
import { ApiFunction } from './type';
import * as path from 'path';

import { getRoundStoragePath } from './helpers';

interface ShowFileResponse {
    status: 'success' | 'error';
}

export const showFile: ApiFunction<[string], ShowFileResponse> = {
    execute: async (event: IpcMainInvokeEvent, originalFilename: string) => {
        try {
            const replayFilePath = path.join(getRoundStoragePath(), `${originalFilename}.rec`);

            shell.showItemInFolder(replayFilePath);
            return {
                status: 'success'
            };
        } catch (err) {
            console.error(err);
            return {
                status: 'error'
            };
        }
    },
    handle: async (originalFilename: string) => {
        return await ipcRenderer.invoke('showFile', originalFilename);
    }
};
