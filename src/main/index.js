import {app, shell, BrowserWindow} from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'


/*
 * Electron Starting point.
 *
 * Vue entry point and non Electron build is at ../main.js
*/
const isDevelopment = process.env.NODE_ENV !== 'production'

const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

// var ses = session.fromPartition('persist:name');

myConsole.log(BrowserWindow, 'defaultSession')


app.on('ready', () => {
  let window = new BrowserWindow({
    width: 760,
    height: 600
  });

  try {
    window.webContents.debugger.attach('1.1')
  } catch (err) {
    myConsole.log('Debugger attach failed : ', err)
  }
  window.webContents.debugger.sendCommand('Network.enable', false)

  // let view = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: false
  //   }
  // })
  // window.setBrowserView(view)

  // session.enableNetworkEmulation({offline: true})

  // BrowserWindow.enableNetworkEmulation({options: {offline: true}})

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
    // Make Chrome run in Offline mode within Electron.
    // https://electronjs.org/docs/api/debugger
    window.webContents.debugger.sendCommand('Network.emulateNetworkConditions', {
      offline: true,
      latency: 1000000.0,
      downloadThroughput: 0.0,
      uploadThroughput: 0.0
    }, myConsole.log)
  }

  // Open external urls (target="_blank") in OS browser.
  window.webContents.on('new-window', function(event, url){
    shell.openExternal(url);
    event.preventDefault();
  });


  window.on("closed", () => {
    window = null;
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  })
})
