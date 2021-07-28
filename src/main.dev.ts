/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  nativeTheme,
  shell,
  Tray,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { FileFilter, IpcMainInvokeEvent } from 'electron/main';
import fs from 'fs';
import QRCode from 'qrcode';
import { promisify } from 'util';
import MenuBuilder from './menu';

const Store = require('electron-store');

const store = new Store({
  hotkey: String,
});

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tray = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const getIcon = () => {
  if (process.platform === 'win32') return '16x16.png';
  if (nativeTheme.shouldUseDarkColors) return '16x16.png';
  return '16x16.png';
};

const showWindow = async () => {
  if (mainWindow == null) {
    await createWindow();
  }
  mainWindow?.show();
};

const createTray = async () => {
  tray = new Tray(path.join(__dirname, '../assets/icons', getIcon()));
  tray.on('click', showWindow);
  tray.setToolTip('PlainBelt');
};

const registerHotKey = () => {
  globalShortcut.unregisterAll();
  const hotkey = 'Control+Alt+Meta+Space';
  const success = globalShortcut.register(hotkey, showWindow);
  if (!success) {
    store.set('hotkey', '');
  } else {
    store.set('hotkey', hotkey);
  }
};

/**
 * Handlers events from React
 */

// This method return a Buffer, if you want to convert to string
// use Buffer.from(buffer).toString()
ipcMain.handle(
  'open-file',
  async (
    _event: IpcMainInvokeEvent,
    filters: FileFilter[],
    type: 'path' | 'buffer'
  ) => {
    const files = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters,
    });

    let content;
    if (files) {
      const fpath = files.filePaths[0];
      if (type === 'path') {
        content = fpath;
      } else {
        content = await promisify(fs.readFile)(fpath);
      }
    }
    return content;
  }
);

ipcMain.handle(
  'generate-qrcode',
  async (_event: IpcMainInvokeEvent, { content }) => {
    return QRCode.toDataURL(content, { width: 1024 });
  }
);

ipcMain.handle(
  'save-file',
  async (_event: IpcMainInvokeEvent, { defaultPath, content, encoding }) => {
    const file = await dialog.showSaveDialog({
      defaultPath,
    });

    if (!file || !file.filePath) return;

    await promisify(fs.writeFile)(file.filePath, content, {
      encoding,
    });
  }
);

ipcMain.handle('get-store', (_event, { key }) => {
  return store.get(key);
});

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app
  .whenReady()
  .then(registerHotKey)
  .then(createWindow)
  .then(createTray)
  .catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
