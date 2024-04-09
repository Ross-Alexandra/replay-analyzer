import { IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { execFileSync } from 'child_process';
import { copyFileSync } from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';

import { getRoundStoragePath, getUtilityLocation, readMetadataFile, writeMetadataFile } from './helpers';
import type { ApiFunction } from './type';


interface UploadRoundGroupResponse {
    status: 'success' | 'error';
    message: string;
    meta: RoundWithMeta[];
}

function getJsonPath(groupFolder: string, fileName: string) {
    return path.join(groupFolder, `${fileName}.json`); 
}

function storeReplayFile(groupFolder: string, file: string) {
    copyFileSync(file, path.join(groupFolder, path.parse(file).base));
}

function saveReplayJson(file: string, saveTo: string) {
    const parameters = [file, '-x', saveTo];
    execFileSync(getUtilityLocation(), parameters);
}

export const uploadRounds: ApiFunction<[string[], string[]], UploadRoundGroupResponse> = {
    execute: async (event: IpcMainInvokeEvent, files: string[], tags: string[]) => {
        try {
            const roundStorage = getRoundStoragePath();
            const fileMetadata = readMetadataFile();

            const uploadedRounds: RoundWithMeta[] = [];
            files.forEach(file => {
                const fileName = path.parse(file).name;
                const jsonPath = getJsonPath(roundStorage, fileName);

                storeReplayFile(roundStorage, file);
                saveReplayJson(file, jsonPath);

                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const fileJson = require(jsonPath);
                fileMetadata.rounds[fileName] = {
                    _id: uuidv4(),
                    tags,
                    map: _.get(fileJson, 'header.map.name'),
                    matchID: _.get(fileJson, 'header.matchID'),
                    roundNumber: _.get(fileJson, 'header.roundNumber'),
                    timestamp: _.get(fileJson, 'header.timestamp'),
                    originalFilename: fileName
                };

                writeMetadataFile(fileMetadata);
                uploadedRounds.push({
                    meta: fileMetadata.rounds[fileName],
                    data: fileJson
                });
            });

            return {
                status: 'success',
                message: 'Successfully uploaded rounds.',
                meta: uploadedRounds
            };
        } catch {
            return {
                status: 'error',
                message: 'Error encountered, please try again. If this error persists, please file an issue.',
                meta: []
            } as UploadRoundGroupResponse;
        }
    },
    handle: async (files: string[], tags: string[]) => {
        return await ipcRenderer.invoke('uploadRounds', files, tags) as UploadRoundGroupResponse;
    }
};