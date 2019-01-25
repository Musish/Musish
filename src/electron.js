const electron = require('electron');

const { app, BrowserWindow } = electron;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    // titleBarStyle: 'hidden',
    webPreferences: {
      sandbox: false,
      nativeWindowOpen: true,
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      affinity: 'main-window',
    },
  });
  mainWindow.loadURL(
    isDev ? 'https://musi.sh/' : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.on(
    'new-window',
    (event, newWindowUrl, frameName, disposition, options, additionalFeatures) => {
      // open window as modal
      //options.frame = true;
      options.webPreferences.affinity = 'main-window';
      options.webPreferences.sandbox = false;
      options.webPreferences.nodeIntegration = false;
      options.webPreferences.sandbox = false;
      options.webPreferences.nativeWindowOpen = true;
      options.webPreferences.allowRunningInsecureContent = true;
      options.webPreferences.contextIsolation = false;
      //console.log(options, additionalFeatures);
    }
  );

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.openDevTools();
  });
  /*
  mainWindow.webContents.on(
    'new-window',
    (event, newWindowUrl, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();
      electron.shell.openExternal(newWindowUrl);
    }
  );
  */
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
