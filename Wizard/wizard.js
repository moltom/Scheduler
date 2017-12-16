let mode = 0;

window.onload = function(){
	renderWizard();
};

function renderWizard(){
	//Constants
	let cont = document.getElementById("container");

	switch(mode){
		case 0: //W1: Dates
			break;
		case 1: //W2: Periods and Times
			break;
		case 2: //W3: Covers
			break;
		case 3: //W4: Student List
			break;
		case 4: //W5: Name and Save
			break;
	}
}

function clearChildren() {
	//Get container
	let cont = document.getElementById("container");

	//Remove children nodes
	if (cont.childNodes.length > 0)
		while (cont.firstChild)
			cont.removeChild(cont.firstChild);
	else //Error
		alert("No children nodes!");
}

function incrementMode(){
	if(mode + 1 > 4)
		alert("Mode cannot exceed 4!");
	else {
		mode++;
		clearChildren();
		renderWizard();
	}
}

function decrementMode(){
	if(mode - 1 < 0)
		alert("Mode cannot go lower!");
	else {
		mode--;
		clearChildren();
		renderWizard();
	}
}