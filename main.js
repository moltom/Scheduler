const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Listen for app ready
app.on('ready', function () {
    //Create new window
    mainWindow = new BrowserWindow({});

    //Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle add window
function createAddWindow(){
    //Create new window
    addWindow = new BrowserWindow({
        width: 600,
        height: 600,
        title: 'Add to List'
    });

    //Load HTML into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pass.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// Catch Item Add
ipcMain.on('item:add',function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

//Create menu function
const mainMenuTemplate = [
    { //Electron
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    { //File
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            }
        ]
    },
    {
        label:'Help',
        submenu:[
            {
                label:'Dev Tools',
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
];