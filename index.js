/*
const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
//Catch webcontents send using IPC Render
ipcRenderer.on('item:add', function(e, item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});
*/

//TABLE CONTROL
window.onload = function() {
	console.log("File contents (within index): " + window.fileContents);
	createTimeTable(window.fileContents);
	createStudentList(window.fileContents);
};

//Date formatter
function formatDate(text){
	let spIndex = text.indexOf(" ");
	let day = text.substring(0, spIndex);
	let rest = text.substring(spIndex+1);
	return [day, rest];
}

function getChildIndexOf(child){
	return [].indexOf.call(child.parentNode.children, child);
}

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
				if(col < 2) // Spacing
					cell.appendChild(document.createTextNode(""));
				else // Day #
					cell.appendChild(document.createTextNode("Day " + (col - 1)))
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
							if(tlength > 1)
								cell.rowSpan = tlength;
						}
						//Filling if rowSpan exists
						else {
							cell.setAttribute("class", "filler");
						}
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