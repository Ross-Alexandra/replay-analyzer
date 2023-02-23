import path = require('path');
import { app } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const CURRENT_METADATA_VERSION = '0.0.1';
const BASE_METADATA = {
    version: CURRENT_METADATA_VERSION,
    rounds: {}
};

export function getAppDataPath() {
    const userDataFolder = app.getPath('appData');
    return path.join(userDataFolder, 'replay-analyzer');
}

export function getInstallPath() {
    return path.join(getAppDataPath(), 'dissect');
}

export function getUtilityLocation() {
    const dissectLocation = path.join(getInstallPath(), 'dissect.exe');

    return dissectLocation;
}

export function getRoundStoragePath() {
    return path.join(getAppDataPath(), 'saved-rounds');
}

export function getMetadataPath() {
    return path.join(getAppDataPath(), 'metadata.json');
}

export function ensureFolderExists(folderPath: string) {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
    }
}

export function ensureFileExists(filePath: string, defaultContent='') {
    if (!existsSync(filePath)) {
        writeFileSync(filePath, defaultContent);
    }
}

export function readMetadataFile(): MetaData  {
    ensureFileExists(getMetadataPath(), JSON.stringify(BASE_METADATA, null, 2));

    const metadataPath = path.join(getAppDataPath(), 'metadata.json');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(metadataPath);
}