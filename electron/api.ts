import { ipcRenderer } from 'electron';

export const test = {
    execute: async () => {
        return 'API is working!';
    },
    handle: async () => {
        return await ipcRenderer.invoke('test');
    }
};
