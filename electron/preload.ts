import { contextBridge } from 'electron';
import {api} from './api';

// Setup the API handlers for when the
// frontend calls them.
const apiHandlers = Object.fromEntries(Object.entries(api).map(([functionName, {handle}]) => [functionName, handle]));
contextBridge.exposeInMainWorld('api', {
    ...apiHandlers
});