const { app, BrowserWindow, globalShortcut, shell, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1500,
        fullscreen: false,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false, // Deprecated in newer Electron versions, avoid if possible
            nodeIntegration: false
        }
    });
    

    mainWindow.loadFile('index.html');

    // Register global shortcut for reloading the page
    globalShortcut.register('CommandOrControl+R', () => {
        mainWindow.reload();
    });

    // Listen for the 'shutdown-app' message
    ipcMain.on('shutdown-app', () => {
        app.quit(); // Quit the application
    });    

    // Open external links in default browser
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === '[') {
            mainWindow.loadFile('intro.html');
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Unregister all global shortcuts when the app is about to quit
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
