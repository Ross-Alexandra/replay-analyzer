import { IpcMainInvokeEvent, app, ipcRenderer } from 'electron';
import { execFileSync } from 'child_process';
import {chain} from 'lodash';
import path = require('path');
import { readFileSync } from 'graceful-fs';

import * as unzip from 'unzip';
import fetch from 'electron-fetch';
import { createWriteStream } from 'fs';

const LATEST_SUPPORTED_VERSION_DOWNLOAD = 'https://github.com/redraskal/r6-dissect/releases/download/v0.9.0/r6-dissect-v0.9.0-windows-amd64.zip';

function getTmpJsonPath(fileName: string) {
    const tempFolder = app.getPath('temp');
    return path.join(tempFolder, `${fileName}.json`);
}

function getInstallPath() {
    const userDataFolder = app.getPath('appData');
    return path.join(userDataFolder, 'replay-analyzer', 'dissect');
}

export const analyzeFiles = {
    execute: async (event: IpcMainInvokeEvent, utilityLocation: string, files: string[]) => {
        try {
            files.forEach(file => {
                const fileName = path.parse(file).name;
                const parameters = [file, '-x', getTmpJsonPath(fileName)];
    
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

        const jsonBlobs = chain(files)
            .map(file => {
                const fileName = path.parse(file).name;
                const fileJson = readFileSync(getTmpJsonPath(fileName));
                const roundJson = JSON.parse(fileJson.toString());

                return roundJson;
            })
            .sortBy('header.roundNumber', 'asc')
            .value();

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

export const downloadLatestSupportedDissect = {
    execute: async () => {
        try {
            const response = await fetch(LATEST_SUPPORTED_VERSION_DOWNLOAD);
            const buffer = await response.buffer();

            await new Promise((resolve, reject) => {
                try {
                    const exePath = path.join(getInstallPath(), 'dissect.exe');
                    const zip = unzip.Parse();
                    zip.on('entry', (entry: unzip.Entry) => {
                        const fileName = entry.path;
        
                        if (fileName === 'r6-dissect.exe') {
                            entry.pipe(createWriteStream(exePath));
                            resolve(fileName);
                        } else {
                            entry.autodrain();
                        }
                    });
        
                    zip.on('close', () => {
                        reject('No dissect.exe found in zip');
                    });

                    zip.on('error', (err: Error) => {
                        reject(err);
                    });

                    zip.write(buffer);
                } catch (err) {
                    reject(err);
                }
            });

            return {
                status: 'success',
                meta: {
                    path: path.join(getInstallPath(), 'dissect.exe')
                }
            };
        } catch (err) {
            return {
                status: 'error',
                meta: {err}
            };
        }
    },
    handle: async () => {
        return await ipcRenderer.invoke('downloadLatestSupportedDissect');
    }
};
