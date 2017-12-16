const electron = require('electron');
const {ipcRenderer} = electron;

// @TODO Creation Wizard
function newSchedule(){
	ipcRenderer.send('open-wizard');
}

function loadSchedule(){
	ipcRenderer.send('open-schedule');
}

// @TODO Options/preferences menu
function openOptions(){

}