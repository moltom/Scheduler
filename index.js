const electron = require('electron');
const {ipcRenderer} = electron;
const remote = require('electron').remote;
/*const ul = document.querySelector('ul');
//Catch webcontents send using IPC Render
ipcRenderer.on('item:add', function(e, item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});*/

let xmlfile;

window.onload = function() {
	openXMLFile(function(contents){
		ipcRenderer.send('show');
		createTimeTable(contents);
		createStudentList(contents);
		xmlfile = contents;
	});
};

//-----File Utility-----
const {dialog} = require('electron').remote;
const fs = require('fs');
parser = new DOMParser();

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

		return fs.readFileSync(files[0], 'utf8');
	});
}

function openXMLFileSync(){
	dialog.showOpenDialog((files) => {
		if (files === undefined){
			console.log("No file selected!");
			return;
		}

		let buffer = fs.readFileSync(files[0], 'utf8');
		return parser.parseFromString(buffer.toString(), "text/xml");
	});
}

//----------TABLE----------
function formatDate(text){
	let spIndex = text.indexOf(" ");
	let day = text.substring(0, spIndex);
	let rest = text.substring(spIndex+1);
	return [day, rest];
}

//Get index of a child object
function getChildIndexOf(child){
	return [].indexOf.call(child.parentNode.children, child);
}

//Time table creation
function createTimeTable(file){
	let table = document.getElementById("time_table");
	let tableHead = document.createElement('thead');
	let tableBody = document.createElement('tbody');

	//Get time table xml data
	let xml = file.getElementsByTagName("time_table")[0];

	//Get table specifications
	let daysNL = xml.getElementsByTagName("day");
	let width = daysNL.length + 2; // 2 for period and time on left
	let height = daysNL[0].getElementsByTagName("time").length + 2; // 2 for date and day on top

	for(let row = 0;row < height;row++){
		//Create new row object
		let table_row = document.createElement("tr");
		for (let col = 0;col < width;col++){
			//Determine if element should be table head or table data
			let cell = document.createElement( (row < 2) ? 'th' : 'td' );

			//Setup first row
			if(row === 0){
				let label = (col < 2) ? "" :  ("Day " + (col - 1));
				cell.appendChild(document.createTextNode(label));
			}

			//Setup second row
			else if(row === 1){
				switch(col){
					case 0:
						cell.appendChild(document.createTextNode("Period"));
						break;
					case 1:
						cell.appendChild(document.createTextNode("Time"));
						break;
					default:
						//Get date info from node list of days in XML
						let dateInfo = formatDate(daysNL[col - 2].getAttribute("date"));
						cell.appendChild(document.createTextNode(dateInfo[0]));
						cell.appendChild(document.createElement("br"));
						cell.appendChild(document.createTextNode(dateInfo[1]));
						break;
				}
			}

			//All other cells
			else{
				let times = daysNL[0].getElementsByTagName("time");
				let index = row - 2;
				switch(col){
					//Period
					case 0:
						//Check time element's index within parent node
						if (getChildIndexOf(times[index]) === 0) {
							let parentPeriod = times[index].parentNode;
							//Get period label from parent
							let label = parentPeriod.getAttribute("label");
							cell.appendChild(document.createTextNode(label));

							//Check if rowSpan is needed in period nodes
							let tlength = parentPeriod.getElementsByTagName("time").length;
							if(tlength > 1) cell.rowSpan = tlength;
						}
						//Filling if rowSpan exists
						else
							cell.setAttribute("class", "filler");
						break;
					//Time
					case 1:
						//Get lesson time label
						let label = times[index].getAttribute("ptime");
						cell.appendChild(document.createTextNode(label));
						break;
					//Student info
					default:
						//Check tag
						let tag = times[index].firstElementChild.tagName;
						if (tag === "name"){
							//Add names
							let live_times = daysNL[col - 2].getElementsByTagName("time");
							let names = live_times[index].getElementsByTagName("name");
							for(let i = 0;i < names.length;i++){
								cell.appendChild(document.createTextNode(names[i].innerHTML));
								if(i < names.length - 1)
									cell.appendChild(document.createElement("br"));
							}
						}
						else if(tag === "cover"){
							if(col === 2){
								let coverTag = times[index].firstElementChild.innerHTML;
								cell.appendChild(document.createTextNode(coverTag));
								cell.colSpan = daysNL.length;
								cell.setAttribute("class", "cover");
							}
							else
								cell.setAttribute("class", "filler");
						}
						break;
				}
			}
			//Finalize row
			table_row.appendChild(cell);
		}

		//Add rows to head and body
		if(row < 2)
			tableHead.appendChild(table_row);
		else
			tableBody.appendChild(table_row);
	}
	table.appendChild(tableHead);
	table.appendChild(tableBody);
}

function createStudentList(file){
	let table = document.getElementById("stu_list");
	let body = document.createElement('tbody');

	//Get time table xml data
	let xml = file.getElementsByTagName("student_list")[0];
	let grades = xml.getElementsByTagName("grade");

	for(let gi = 0; gi < grades.length; gi++){
		let students = grades[gi].getElementsByTagName("student");

		//Add grade header
		let ghRow = document.createElement("tr");
		let ghInner = document.createElement("th");
		let label = grades[gi].getAttribute("year") + "th Grade";
		ghInner.appendChild(document.createTextNode(label));
		ghRow.appendChild(ghInner);
		body.appendChild(ghRow);

		for(let si = 0; si < students.length; si++){
			//Create table elements
			let sRow = document.createElement("tr");
			let data = document.createElement("td");

			//Get student name
			let stu_name = students[si].getElementsByTagName("name")[0].innerHTML;

			//Add elements to table
			data.appendChild(document.createTextNode(stu_name));
			sRow.appendChild(data);
			body.appendChild(sRow);
		}
	}

	table.appendChild(body);
}

function addButtons(){

}