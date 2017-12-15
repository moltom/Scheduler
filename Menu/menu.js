const electron = require('electron');
const {ipcRenderer} = electron;

// @TODO Creation Wizard
function newSchedule(){
	//Load creation wizard
}

function loadSchedule(){
	openXMLFile(function(contents){
		storeFile(contents);
		ipcRenderer.send('file:loaded');
	});
}

// @TODO Options/preferences menu
function openOptions(){

}

//-----File Utility-----
const {dialog} = require('electron').remote;
const fs = require('fs');
parser = new DOMParser();

function storeFile(data){
	window.fileContents = data;
}

function loadXML(file_name, callback){
	fs.readFile(file_name, function(err,data){
		let value = parser.parseFromString(data.toString(), "text/xml");
		callback(value);
	});
}

function openXMLFile(callback){
	dialog.showOpenDialog((files) => {
		if (files === undefined){
			console.log("No file selected!");
			return;
		}

		fs.readFile(files[0], function(err,data){
			let value = parser.parseFromString(data.toString(), "text/xml");
			callback(value);
		});
	});
}