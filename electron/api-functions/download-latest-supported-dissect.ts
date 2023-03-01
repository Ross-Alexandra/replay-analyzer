import { ipcRenderer } from 'electron';
import { execFile } from 'child_process';
import * as unzip from 'unzip';
import fetch from 'electron-fetch';
import { createWriteStream } from 'fs';
import { ensureFolderExists, getInstallPath, getUtilityLocation } from './helpers';
import { ApiFunction } from './type';

const LATEST_SUPPORTED_VERSION = 'v0.9.0';
const LATEST_SUPPORTED_VERSION_DOWNLOAD = 'https://github.com/redraskal/r6-dissect/releases/download/v0.9.0/r6-dissect-v0.9.0-windows-amd64.zip';

interface DownloadLatestSupportedDissectResponse {
    status: 'success' | 'error';
}

async function getDissectVersion() {
    const parameters = ['-v'];

    return new Promise<string>((resolve) => {
        execFile(getUtilityLocation(), parameters, (err, stdout, stderr) => {
            if (err) {
                resolve('v0.0.0');
            } else {
                resolve(stdout.concat(stderr).trim());
            }
        });
    });
}

async function extractAndWriteExeFromZipBuffer(buffer: Buffer) {
    return new Promise((resolve, reject) => {
        try {
            const exePath = getUtilityLocation();
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
}

export const downloadLatestSupportedDissect: ApiFunction<[], DownloadLatestSupportedDissectResponse> = {
    execute: async () => {
        try {
            // Ensure at a minimum the dissect folder exists
            // before trying to execute the dissect binary.
            ensureFolderExists(getInstallPath());

            const version = await getDissectVersion();
            const versionString = version.toString().match(/v(\d+).(\d+).(\d+)/g);

            // Don't download if we already have the latest version.
            if (versionString && versionString[0] === LATEST_SUPPORTED_VERSION) {
                return {status: 'success'};
            }

            const dissectZip = await fetch(LATEST_SUPPORTED_VERSION_DOWNLOAD);
            const zipBuffer = await dissectZip.buffer();

            await extractAndWriteExeFromZipBuffer(zipBuffer);

            return {status: 'success'};
        } catch (err) {
            return {status: 'error'};
        }
    },
    handle: async () => {
        return await ipcRenderer.invoke('downloadLatestSupportedDissect');
    }
};
