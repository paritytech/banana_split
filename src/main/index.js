import {app, BrowserWindow} from 'electron'

app.on('ready', () =>{
  let window = new BrowserWindow({
    // width: 800,
    // height: 600
  });
  window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
})
