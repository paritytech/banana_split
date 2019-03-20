import {app, BrowserWindow} from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'


/*
 * Electron Starting point.
 *
 * Vue entry point and non Electron build is at ../main.js
*/
const isDevelopment = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
  let window = new BrowserWindow({
    // width: 800,
    // height: 600
  });
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }
})
