// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
global.settings = {}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: global.settings.windowSize.width,
    height: global.settings.windowSize.height,
    x: global.settings.windowPosition.x,
    y: global.settings.windowPosition.y,
    frame: global.settings.frame,
    transparent: global.settings.transparency,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  global.sharedObject = {os: os}
  setInterval( () => {
		global.sharedObject = {
		  os: os
		}
	}, global.settings.refreshRate)
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
	setTimeout( () => {
		let path = '/home/' + require("os").userInfo().username + '/.floatinfo'
		console.log('trying to find settings at ' + path)
		if(!fs.existsSync(path)){
			console.log('creating new settings file...')
			let settings = fs.readFileSync('settings.json', 'utf8')
			fs.writeFileSync(path, settings, 'utf8')
			global.settings = JSON.parse(settings)
		} else {
			console.log('found settings file')
			global.settings = JSON.parse(fs.readFileSync(path))
		}
		
		createWindow()
	}, 300)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
