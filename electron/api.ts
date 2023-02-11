import { IpcMainInvokeEvent, app, ipcRenderer } from 'electron';
import { execFileSync } from 'child_process';
import {chain} from 'lodash';
import path = require('path');
import { readFileSync } from 'fs';

function getTmpJsonPath(fileName: string) {
    const tempFolder = app.getPath('temp');
    return path.join(tempFolder, `${fileName}.json`);
}

export const analyzeFiles = {
    execute: async (event: IpcMainInvokeEvent, utilityLocation: string, files: string[]) => {
        try {
            files.forEach(file => {
                const fileName = path.parse(file).name;
                const parameters = [file, '-x', getTmpJsonPath(fileName)];
    
                console.log(`Executing ${utilityLocation} ${parameters.join(' ')}`);
                execFileSync(utilityLocation, parameters);
                console.log('success');
            });
        } catch {
            return {
                response: {
                    status: 'error',
                    message: 'Error encountered, please try again. If this message persists, please file an issue.'
                }
            };
        }

        const jsonBlobs = chain(files)
            .map(file => {
                const fileName = path.parse(file).name;
                const fileJson = readFileSync(getTmpJsonPath(fileName));
                const roundJson = JSON.parse(fileJson.toString());

                return roundJson;
            })
            .sortBy('header.roundNumber', 'asc')
            .value();

        console.log(jsonBlobs.map(blob => blob.header.roundNumber));
        return {
            response: {
                status: 'success',
                message: 'Success!',
                data: jsonBlobs
            }
        };
    },
    handle: async (utilityLocation: string, files: string[]) => {
        return await ipcRenderer.invoke('analyzeFiles', utilityLocation, files);
    }
};
