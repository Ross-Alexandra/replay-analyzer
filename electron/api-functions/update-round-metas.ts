import { IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { ApiFunction } from './type';
import * as _ from 'lodash';
import { readMetadataFile, writeMetadataFile } from './helpers';

interface RoundMetaUpdate {
    _id: string;
    newMeta: Partial<RoundMeta>;
}

interface UpdateRoundMetaResponse {
    successes: string[];
    errors: string[];
}

export const updateRoundMetas: ApiFunction<[RoundMetaUpdate[]], UpdateRoundMetaResponse> = {
    execute: async (event: IpcMainInvokeEvent, updates: RoundMetaUpdate[]) => {
        const ids = updates.map(({_id}) => _id);
        const successes: string[] = [];
        
        try {
            const metadata = readMetadataFile();
            const rounds = metadata.rounds;

            updates.forEach(({_id: id, newMeta}) => {
                const round = _.find(rounds, {_id: id});

                if (round) {
                    rounds[round.originalFilename] = {
                        ...round,
                        ...newMeta
                    };

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
    handle: async (updates: RoundMetaUpdate[]) => {
        return await ipcRenderer.invoke('updateRoundMetas', updates);
    }
};
