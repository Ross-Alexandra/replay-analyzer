import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as api from './api';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import electronReload from 'electron-reload';

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

    win.setResizable(false);

    if (isDev) {
        win.loadURL('http://localhost:3000/index.html');
    } else {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../index.html`);
    }

    win.on('closed', () => win = null);

    // Hot Reloading
    if (isDev) {
        // 'node_modules/.bin/electronPath'
        electronReload(__dirname, {
            electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
            forceHardReset: true,
            hardResetMethod: 'exit'
        });
    }

    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

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

Object.entries(api).forEach(([functionName, {execute}]) => {
    ipcMain.handle(functionName, execute);
});
