const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let menu;
let scheduleWindow;
let wizard;

let addWindow;


//Global variables
global.xmlfile = {contents: null};

//Listen for app ready
app.on('ready', function () {
	createMenu();
});

ipcMain.on('open-schedule', function(){
	console.log("Opening schedule...");
	createScheduleWindow();
});

ipcMain.on('open-wizard', function(){
	console.log("Opening wizard...");
	createWizard();
});

ipcMain.on('show', function(){
	console.log("Schedule data loaded: Showing...");
	scheduleWindow.show();
	menu.close();
});

ipcMain.on('print', function(event, arg){
	console.log(arg);
});

//Generate Menu Window
function createMenu(){
	menu = new BrowserWindow({
		width: 400,
		height: 400,
		minWidth: 400,
		minHeight: 400,
		maxWidth: 400,
		maxHeight: 400,
		titleBarStyle: 'hidden'
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

function createWizard(){
	//Create new window
	wizard = new BrowserWindow({
		width: 1100,
		height: 750,
		show: false
	});

	//Load HTML into window
	wizard.loadURL(url.format({
		pathname: path.join(__dirname, 'Wizard/wizard.html'),
		protocol: 'file:',
		slashes: true
	}));
}

//Generate schedule window
function createScheduleWindow(){
	//Create new window
	scheduleWindow = new BrowserWindow({
		width: 1100,
		height: 750,
		show: false
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

//const name = app.getName();
const mainMenuTemplate = [
    { //Electron
	    label: "Scheduler",
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
	{
		label: 'Table',
		submenu: [
			{
				label: 'Add Day',
				click(){
					//Something
				}
			},
			{
				label: 'Remove Day',
				click(){
					//Something
				}
			},
			{type: 'separator'},
			{
				label: 'Add Period',
				click(){
					//Something
				}
			},
			{
				label: 'Remove Period',
				click(){
					//Something
				}
			},
			{type: 'separator'},
			{
				label: 'Add Time',
				click(){
					//Something
				}
			},
			{
				label: 'Remove Time',
				click(){
					//Something
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