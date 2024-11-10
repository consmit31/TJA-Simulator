const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800, // Adjust width as needed
        height: 650, // Adjust height as needed
        webPreferences: {
            contextIsolation: false, // Required for Node integration
            enableRemoteModule: true,
            nodeIntegration: true // Allows Node.js modules in the renderer
        }
    });

    win.loadFile('prototype.html');  // Point to your game's HTML file

    // Dynamically set the canvas size based on the window size
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(`
            const canvas = document.getElementById('PrototypeCanvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        `);
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
