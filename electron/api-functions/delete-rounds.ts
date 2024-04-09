import { IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { ApiFunction } from './type';
import * as _ from 'lodash';
import { getRoundStoragePath, readMetadataFile, writeMetadataFile } from './helpers';
import { unlinkSync } from 'fs';
import path = require('path');

interface DeleteRoundsResponse {
    successes: string[];
    errors: string[];
}

export const deleteRounds: ApiFunction<[string[]], DeleteRoundsResponse> = {
    execute: async (event: IpcMainInvokeEvent, ids: string[]) => {
        const successes: string[] = [];
        
        try {
            const metadata = readMetadataFile();
            const rounds = metadata.rounds;

            ids.forEach(id => {
                const round = _.find(rounds, {_id: id});

                if (round) {
                    delete rounds[round.originalFilename];

                    unlinkSync(path.join(getRoundStoragePath(), `${round.originalFilename}.json`));
                    unlinkSync(path.join(getRoundStoragePath(), `${round.originalFilename}.rec`));

                    successes.push(id);
                }
            });

            writeMetadataFile(metadata);
        } catch (err) {
            console.error(err);
        }

        return {
            successes,
            errors: _.difference(ids, successes)
        };
    },
    handle: async (ids: string[]) => {
        return await ipcRenderer.invoke('deleteRounds', ids);
    }
};
