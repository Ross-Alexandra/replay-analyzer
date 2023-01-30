import { IpcMainInvokeEvent, app, ipcRenderer } from 'electron';
import { execFileSync } from 'child_process';
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
                const parameters = [`${file}`, '-x json', getTmpJsonPath(fileName)];
    
                execFileSync(utilityLocation, parameters);
            });
        } catch {
            return {
                response: {
                    status: 'error',
                    message: 'Error encountered, please try again. If this message persists, please file an issue.'
                }
            };
        }

        const jsonBlob: Record<string, string> = {};
        files.forEach(file => {
            const fileName = path.parse(file).name;
            const fileJson = readFileSync(getTmpJsonPath(fileName));
            const jsonData = JSON.parse(fileJson.toString());

            const roundNumber = jsonData.header.roundNumber as number;
            jsonBlob[`round-${roundNumber}`] = jsonData;
        });

        return {
            response: {
                status: 'success',
                message: 'Success!',
                data: jsonBlob
            }
        };
    },
    handle: async (utilityLocation: string, files: string[]) => {
        return await ipcRenderer.invoke('analyzeFiles', utilityLocation, files);
    }
};
