const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let scheduleWindow;
let addWindow;
let menu;

//Listen for app ready
app.on('ready', function () {
	createMenu();
});

ipcMain.on('file:loaded', function(){
	createScheduleWindow();
	menu.close();
});

ipcMain.on('open', function(){
	testWindow();
});

ipcMain.on('print', function(event, arg){
	console.log(arg);
});

let test;
function testWindow(){
	test = new BrowserWindow({
		width: 500,
		height: 600
	});
}

//Generate Menu Window
function createMenu(){
	menu = new BrowserWindow({
		width: 400,
		height: 400
	});

	menu.loadURL(url.format({
		pathname: path.join(__dirname, 'Menu/menu.html'),
		protocol: 'file:',
		slashes: true
	}));

	/*
	//Quit app when closed
	menu.on('closed', function(){
		app.quit();
	});*/

	//Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//Insert menu
	Menu.setApplicationMenu(mainMenu);
}

//Generate schedule window
function createScheduleWindow(){
	//Create new window
	scheduleWindow = new BrowserWindow({
		width: 1100,
		height: 750
	});

	//Load HTML into window
	scheduleWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	//Quit app when closed
	/*
	scheduleWindow.on('closed', function(){
		app.quit();
	});*/
}

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
    scheduleWindow.webContents.send('item:add', item);
    addWindow.close();
});

//Create menu function
const mainMenuTemplate = [
    { //Electron
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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
                label: 'New Schedule',
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    //Create new Schedule
                }
            },
            {
                label: 'Open Schedule',
                accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){
                    createScheduleWindow();
                }
            }
        ]
    },
    { //View
        label: 'View',
        submenu: [
            {
                label: 'View Ex. Pass',
                click(){
                    createAddWindow();
                }
            }
        ]
    },
    { //Help
        label:'Help',
        submenu:[
            {
                label:'Dev Tools',
                accelerator:process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
];