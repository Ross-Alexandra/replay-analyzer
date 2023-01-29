import { contextBridge } from 'electron';
import * as api from './api';

export interface ElectronApi {
    test: string;
}

const apiHandlers = Object.fromEntries(Object.entries(api).map(([functionName, {handle}]) => [functionName, handle]));
contextBridge.exposeInMainWorld('api', {
    ...apiHandlers
});