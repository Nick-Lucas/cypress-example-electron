// @ts-check
console.log('in %s', __filename)

const arg = require('arg')
const args = arg(
  {
    '--cypress-runner-url': String,
    '--load-extension': String
  },
  { permissive: true }
) // allow unknown options

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // if (args['--load-extension']) {
  //   const extensions = args['--load-extension'].split(',')
  //   extensions.forEach(ext => {
  //     console.log('loading extension', ext)
  //     const name = BrowserWindow.addExtension(ext)
  //     console.log('extension has returned name: %s', name)
  //   })
  //   console.log('loaded extensions\n%s', extensions.join('\n'))
  // }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Main electron app',
    webPreferences: {
      // ? should we just preload Cypress scripts if passed
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      nativeWindowOpen: true,
      webSecurity: false,
      devTools: true
    }
  })
  // mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  if (args['--cypress-runner-url']) {
    console.log('loading Cypress url %s', args['--cypress-runner-url'])
    // see https://electronjs.org/docs/api/window-open
    // for all options, like node integration, preload etc.
    let testRunnerWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'Specs',
      webPreferences: {
        nativeWindowOpen: true,
        webSecurity: false,
        devTools: true
      }
    })
    testRunnerWindow.loadURL(args['--cypress-runner-url'])
    console.log('testWindow is', testRunnerWindow)

    mainWindow.loadFile('index.html')
  } else {
    console.log('loading file index.html')
    mainWindow.loadFile('index.html')
  }

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
app.on('ready', createWindow)

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
