const electron = require('electron');
const {ipcRenderer} = electron
const ul = document.querySelector('ul');

//Catch webcontents send using IPC Render
ipcRenderer.on('item:add', function(e, item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});