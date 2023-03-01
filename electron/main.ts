import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import {api} from './api';

// Setup the API executers for when the
// frontend calls them.
Object.entries(api).forEach(([functionName, {execute}]) => {
    ipcMain.handle(functionName, execute);
});

let win: BrowserWindow | null = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setResizable(true);

    if (isDev) {
        win.loadURL('http://localhost:3000/index.html');
    } else {
        win.loadURL(`file://${__dirname}/../index.html`);
    }

    win.on('closed', () => win = null);

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    if (isDev) {
        win.webContents.openDevTools();
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
