import { ipcRenderer } from 'electron';
import { ApiFunction } from './type';
import { ensureFolderExists, getRoundStoragePath, readMetadataFile } from './helpers';
import { readFileSync, readdirSync } from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

interface getAllRoundsResponse {
    rounds: RoundWithMeta[];
}

function getJsonsFilesInFolder(folder: string) {
    const files = readdirSync(folder);
    return _.chain(files)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(folder, file))
        .value();
}

function getJsonFromFile(file: string) {
    const jsonBuffer = readFileSync(file);

    return JSON.parse(jsonBuffer.toString());
}

export const getAllRounds: ApiFunction<[], getAllRoundsResponse> = {
    execute: async () => {
        const roundsStorage = getRoundStoragePath();

        ensureFolderExists(roundsStorage);
        const jsonFiles = getJsonsFilesInFolder(roundsStorage);

        const metadata = readMetadataFile();

        const rounds = _.chain(jsonFiles)
            .map(file => ({
                meta: metadata.rounds[path.parse(file).name] as RoundMeta,
                data: getJsonFromFile(file) as Round
            }) as RoundWithMeta)
            .value();

        return {rounds} as getAllRoundsResponse;
    },
    handle: async () => {
        return await ipcRenderer.invoke('getAllRounds');
    }
};
