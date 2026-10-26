// upon start:
document.addEventListener("DOMContentLoaded", () => {
	populateTable();
	attachFilterLabelListeners();
	populatePartnersCbxs();
	attachAEDListeners();
	
	setupToggle("#projects-toggle", "#projects-table"); // just reusing code from projectdetails quickly
});

function setupToggle(buttonId, tableId) { // versatile function for the 3 tables in the page
	const btn = document.querySelector(buttonId);
	const table = document.querySelector(tableId);
	
	btn.addEventListener("click", () => {
		const isHidden = table.style.display === "none";
		
		table.style.display = isHidden ? "table" : "none";
		btn.textContent = isHidden ? "Hide Table ▲" : "Show Table ▼";
	});
}

// fill table with rows & filtering functionality:
// ------------------------------------------------------------------------------------------------------------------
let allProjects = []; // global variable within this file, so filtering can work
function populateTable() {
	// https://gist.github.com/timdereaper1/ce528ab060c113cf86e4aece96198f6d
	const tableBody = document.querySelector('tbody');
	
	fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
		method: "POST",
		body: new URLSearchParams({ query: `SELECT pr.*, pa.partnerName FROM tblProject pr JOIN tblPartner pa ON pr.partnerId = pa.partnerId ORDER BY pr.projectId;` }) // the query. adding an orderby just to be safe.
	})
	.then((response) => response.json() ) // converts the response to a json object. 
	.then((result) => { 
		console.log(result);
		allProjects = result.data; // store data to global variable
		renderTable(allProjects); // render full table initially, with all original rows just freshly fetched from db.
	})
	.catch(console.error);
}
function renderTable(projects) {
	const tableBody = document.querySelector('tbody');
	let htmlToAdd = "";
	
	projects.forEach((project) => {
		htmlToAdd += 
		`<tr>
			<td>${project.projectId}</td>
			<td>${project.projectTitle}</td>
			<td>${project.partnerName}</td>
			<td>${project.projectStartDate}</td>
			<td>${project.projectLengthDays}</td>
			<td>${project.projectSummary}</td>
			<td style="text-align: center">
				<button onclick="openProjectDetails(${project.projectId})"><span style='font-size:50px;'>&#8203;   &#8599;   &#8203;</span></button>
			</td>
			<td>
				<button onclick="loadProjectForEditing(${project.projectId})">
					<span style='font-size:50px;'>&#128393;</span>
				</button>
			</td>
			<td>
				<button onclick="deleteProject(this, ${project.projectId})">
					<span style='font-size:50px;'>&#128465;</span>
				</button>
			</td>
		</tr>`; // displaying the fields of title, startdate, noOfDays, & summary.
				// link for arrow: https://www.w3schools.com/charsets/ref_utf_arrows.asp
				// ?id= knowledge from experience of seeing other websites do the same thing. should bring over data to new page
				// edit-pencil & delete-bin symbols; https://www.compart.com/en/unicode/U+1F5D1 & https://www.compart.com/en/unicode/U+1F589
				// not sure how textalign:center still works for elements, not just text
				// openInNewTab spacing to expand button: https://code.quora.com/https-www-quora-com-How-do-you-insert-an-invisible-character-in-HTML-answer-Muhammad-Ali-Affiliate-Marketing-Digital-M
				// have to add "this" parameter in deleteProject to send in the button that's clicked, to know which one to disable double clicking in.
	});
	
	tableBody.innerHTML = htmlToAdd;
}

function attachFilterLabelListeners() { // https://stackoverflow.com/questions/26946235/pure-javascript-listen-to-input-value-change
	document.getElementById("projNameFInput").addEventListener("input", filterTable);
	document.getElementById("startDateFInput").addEventListener("input", filterTable);
	document.getElementById("partnerInvolvedFInput").addEventListener("input", filterTable);
}

function filterTable() {
	const nameFilter = document.getElementById("projNameFInput").value.toLowerCase();
	const dateFilter = document.getElementById("startDateFInput").value;
	const partnerFilter = document.getElementById("partnerInvolvedFInput").value.toLowerCase();
	
	const filteredRows = allProjects.filter(project => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
		const matchesName = project.projectTitle.toLowerCase().includes(nameFilter);
		const matchesDate = dateFilter === "" || project.projectStartDate === dateFilter;
		const matchesPartner = project.partnerName.toLowerCase().includes(partnerFilter);
	
		return matchesName && matchesDate && matchesPartner;
	});
	
	renderTable(filteredRows);
}
function populatePartnersCbxs() {
	const partnersAddCbx = document.getElementById("addPartnersCbx");
	const partnersEditCbx = document.getElementById("editPartnersCbx");
	
	// query DB for all partners (id & name combos) and store into global variable to check against when submitting successfully.
	fetch(`https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php`, {
		method: "POST",
		body: new URLSearchParams({
			query: `SELECT partnerId, partnerName FROM tblPartner ORDER BY partnerName;` // just adding an orderby to ensure combobox is in alphabetical order for combobox, regardless of partnerId
		})
	})
	.then((response) => response.json())
	.then((result) => {
		// console.log("fetched partners result:", result);
		
		const allPartners = result.data;
		
		// now all partners should be fetched, lets add them to the combobox:
		// https://stackoverflow.com/questions/6601028/how-to-populate-the-options-of-a-select-element-in-javascript
		// console.log("about to start allpartners foreach");
		allPartners.forEach((partner) => {
			const optAdd = document.createElement("option");
			const optEdit = document.createElement("option"); // so, apparently, the single opt variable i created cant be in 2 places at once, which is why my editcbx would fill but not my addcbx. my goodness.
			
			optAdd.value = partner.partnerId; // means i can use the value of the option selected by the user in the sql insert statement, no need for a global allpartners :D
			optEdit.value = partner.partnerId;
			optAdd.text  = partner.partnerName;
			optEdit.text  = partner.partnerName;
			
			// console.log(partner.partnerId + " | " + partner.partnerName);
			
			// add currently foreach-looped partner to combobox, before moving onto next partner
			partnersAddCbx.add(optAdd);
			partnersEditCbx.add(optEdit);
		});
		
		console.log("ended allpartners foreach");
	})
	.catch(console.error);
}
// ------------------------------------------------------------------------------------------------------------------




// AED functionality
// ------------------------------------------------------------------------------------------------------------------
function attachAEDListeners() { // when submit buttons get clicked, these are triggered for respective form.
	document.getElementById("addProjectForm").addEventListener("submit", async (event) => {
		event.preventDefault(); // to stop the page refresh
		
		// disable button from double clicks, as spec requires
		const submitBtn = event.target.querySelector("button[type='submit']");
		submitBtn.disabled = true;
		
		try { await addProject(); }
		finally {submitBtn.disabled = false; } // no matter what after the try block, reenable the button
	});
	
	document.getElementById("editProjectForm").addEventListener("submit", async (event) => {
		event.preventDefault();
		
		const submitBtn = event.target.querySelector("button[type='submit']");
		if (submitBtn.disabled) return; // a hard guard to prevent going any further just in case
		
		submitBtn.disabled = true;
		
		const projId = document.getElementById("editProjectPreface").innerText.split('#')[1]; // maybe not best approach, but grabbing the data off the screen rather than making a global variable.
	
		await submitEditedProject(projId);
	
		// reenable after everything completed
		setTimeout(() => {
			submitBtn.disabled = false;
		}, 3000);
	});
}

function openTab(id) { // switch between tabs, code used as found in other pages
	const divToBeShown = document.getElementById(id);
	if (id === "functional-edit-project") { // special handling here, so you dont click 2 edits & it disappears, instead they should show anyway.
		document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
		divToBeShown.style.display = 'block';
		
		// and then scroll it into view, it looks good.; https://notesontech.com/auto-scroll/#method-2-javascript
		const form = document.getElementById("editProjectForm");
		form.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	} else if(divToBeShown.style.display == 'block') { // you click the button a 2nd time in a row, the div disappears.
		document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
	} else {
		document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
		divToBeShown.style.display = 'block';
	}
}

// Adding Project
// ==============================================================================================================================
async function addProject() {
	const partnersCbx = document.getElementById("addPartnersCbx");
	
	const project = {
		title: document.getElementById("addProjTitleInput").value.trim(),
		partnerId: partnersCbx.value,
		startDate: document.getElementById("addStartDateInput").value,
		noOfDays: document.getElementById("addNoOfDaysInput").value,
		summary: document.getElementById("addSummaryInput").value.trim()
	};
	
	if(isProjectValidAdd(project.title, project.partnerId, project.startDate, project.noOfDays, project.summary)) {
		await addProjectToDatabase(project.title, project.partnerId, project.startDate, project.noOfDays, project.summary);
		clearAddProjectInputs();
		
		// https://www.w3schools.com/cssref/pr_class_display.php
		const successMessage = document.getElementById("confirm-added-project");
		successMessage.style.display = "block";
		setTimeout(() => successMessage.style.display = "none", 3000); // set it back to disappear after 3 seconds automatically, rather than an alert. // https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
		
		// alert("Project Added Successfully!"
			// + "\n\tTitle:                       " + project.title
			// + "\n\tPartner ID:              " + project.partnerId 
			// + "\n\tStart Date:              " + project.startDate
			// + "\n\tNumber Of Days:   " + project.noOfDays
			// + "\n\tSummary:               " + project.summary); // aligned for neatness after much trial & error to get correct no/ of spaces
	}
}

function isProjectValidAdd(projectTitle, partnerId, startDate, noOfDays, summary) {
	document.getElementById("addPartnersCbx").setCustomValidity(""); // reset validity for these 2 elements, just in case, even though this is already done in the later validations.
	document.getElementById("addStartDateInput").setCustomValidity("");
	
	// projTitle handled in html
	console.log("Project Title: " + projectTitle);
	
	// partnerId
	console.log("Partner ID: " + partnerId);
	if(partnerId === "0") {
		// through much testing, these 3 lines in succession are essential:
		document.getElementById("addPartnersCbx").setCustomValidity("Please select a partner."); // sets it to invalid; has a value other than "" (empty, which is valid)
		document.getElementById("addPartnersCbx").reportValidity(); // display the error message
		document.getElementById("addPartnersCbx").setCustomValidity(""); // reset back to valid, cause:
		return false; // return false, as it's invalid
	}
	
	// startDate
	console.log("Start Date: " + startDate);
	if(startDate === "") { // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date; input dates .value return strings like: 2018-07-22
		document.getElementById("addStartDateInput").setCustomValidity("Please enter a date.");
		document.getElementById("addStartDateInput").reportValidity();
		document.getElementById("addStartDateInput").setCustomValidity("");
		return false;
	}
	
	// noOfDays handled in html
	console.log("No Of Days: " + noOfDays);
	
	// summary handled in html
	console.log("Summary: " + summary);
	
	// alert("Reached End of Validation: "
			// + "\n Title:" + projectTitle
			// + "\n Partner ID:" + partnerId 
			// + "\n Start Date:" + startDate
			// + "\n Number Of Days:" + noOfDays
			// + "\n Summary:" + summary);
	return true;
}

function clearAddProjectInputs() {
	document.getElementById("addProjectForm").reset(); // https://stackoverflow.com/questions/17237772/html-how-to-clear-input-using-javascript
}

async function addProjectToDatabase(projectTitle, partnerId, startDate, noOfDays, summary) {
	return fetch(`https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php`, {
		method: "POST",
		body: new URLSearchParams({
			query: `INSERT INTO tblProject (projectTitle, projectStartDate, projectLengthDays, projectSummary, partnerId) VALUES ('${projectTitle}', '${startDate}', '${noOfDays}', '${summary}', '${partnerId}');`
		})
	})
	.then(response => response.json())
	.then((result) => {
		populateTable(); // redraw the table after inserting the new record.
		clearAddProjectInputs(); // empty the inputs
	})
	.catch((error) => console.log(error) );
}


// ==============================================================================================================================



// Editing Project
// ==============================================================================================================================
function loadProjectForEditing(projectId) {
	console.log("Editing project: " + projectId);
	fillEditProjectInputs(projectId);
	openTab("functional-edit-project");
}
function fillEditProjectInputs(projectId) {
	// query DB for all partners (id & name combos) and store into global variable to check against when submitting successfully.
	fetch(`https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php`, {
		method: "POST",
		body: new URLSearchParams({
			query: `SELECT * FROM tblProject WHERE projectId=${projectId};`
		})
	})
	.then((response) => response.json())
	.then((result) => {
		const project = result.data[0];
		console.log("Reponse of project select for project #" + projectId + ": " + project.text);
		
		// https://www.geeksforgeeks.org/javascript/set-the-value-of-an-input-field-in-javascript/
		document.getElementById("editProjectPreface").innerHTML = "Viewing Project \"" + project.projectTitle + "\", ID: #" + projectId;
		document.getElementById("editProjTitleInput").value = project.projectTitle;
		document.getElementById("editPartnersCbx").value = project.partnerId;
		document.getElementById("editStartDateInput").value = project.projectStartDate;
		document.getElementById("editNoOfDaysInput").value = project.projectLengthDays;
		document.getElementById("editSummaryInput").value = project.projectSummary;
	})
	.catch(error => {
		console.log(error);
	});
}


async function submitEditedProject(projectId) { // if parameter/projId == 0, then show default screen. otherwise, load everything up.
	const partnersCbx = document.getElementById("editPartnersCbx");
	
	const project = {
		title: document.getElementById("editProjTitleInput").value.trim(),
		partnerId: partnersCbx.value,
		startDate: document.getElementById("editStartDateInput").value,
		noOfDays: document.getElementById("editNoOfDaysInput").value,
		summary: document.getElementById("editSummaryInput").value.trim()
	};
	
	if(isProjectValidEdit(project.title, project.partnerId, project.startDate, project.noOfDays, project.summary)) {
		await updateProjectInDatabase(projectId, project.title, project.partnerId, project.startDate, project.noOfDays, project.summary);
		// closeTabs();
		
		// https://www.w3schools.com/cssref/pr_class_display.php
		const successMessage = document.getElementById("confirm-edited-project");
		successMessage.style.display = "block";
		setTimeout(() => {
			successMessage.style.display = "none"; // set it back to disappear after 3 seconds automatically, rather than using an alert. https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
			closeTabs();
		}, 3000);
		
		// alert("Project Updated Successfully!"
			// + "\n\tTitle:                       " + project.title
			// + "\n\tPartner ID:              " + project.partnerId 
			// + "\n\tStart Date:              " + project.startDate
			// + "\n\tNumber Of Days:   " + project.noOfDays
			// + "\n\tSummary:               " + project.summary); // aligned for neatness. looks beautiful, & did this offsetting first try haha.
	}
}

function isProjectValidEdit(projectTitle, partnerId, startDate, noOfDays, summary) {
	document.getElementById("editPartnersCbx").setCustomValidity(""); // reset validity for these 2 elements, just in case, even though this is already done in the later validations.
	document.getElementById("editStartDateInput").setCustomValidity("");
	
	// projTitle handled in html
	console.log("Project Title: " + projectTitle);
	
	// partnerId
	console.log("Partner ID: " + partnerId);
	if(partnerId === "0") {
		// through much testing, these 3 lines in succession are essential:
		document.getElementById("editPartnersCbx").setCustomValidity("Please select a partner."); // sets it to invalid; has a value other than "" (empty, which is valid)
		document.getElementById("editPartnersCbx").reportValidity(); // display the error message
		document.getElementById("editPartnersCbx").setCustomValidity(""); // reset back to valid, cause:
		return false; // return false, as it's invalid
	}
	
	// startDate
	console.log("Start Date: " + startDate);
	if(startDate === "") { // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date; input dates .value return strings like: 2018-07-22
		document.getElementById("editStartDateInput").setCustomValidity("Please enter a date.");
		document.getElementById("editStartDateInput").reportValidity();
		document.getElementById("editStartDateInput").setCustomValidity("");
		return false;
	}
	
	// noOfDays handled in html
	console.log("No Of Days: " + noOfDays);
	
	// summary handled in html
	console.log("Summary: " + summary);
	
	return true;
}
async function updateProjectInDatabase(projectId, title, partnerId, startDate, noOfDays, summary) {
	return fetch(`https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php`, {
		method: "POST",
		body: new URLSearchParams({
			query: `UPDATE tblProject SET projectTitle = '${title}', projectStartDate = '${startDate}', projectSummary = '${summary}', projectLengthDays = '${noOfDays}', partnerId = '${partnerId}' WHERE projectId = ${projectId};`
		})
	})
	.then(response => response.json())
	.then((result) => {
		populateTable(); // redraw the table after updating the new record.
	})
	.catch((error) => console.log(error) );
}
// ==============================================================================================================================



// Deleting Project
// ==============================================================================================================================
async function deleteProject(button, projectId) {
	button.disabled = true;
	if (!confirm("Are you sure you want to delete Project #" + projectId + "?")) { // if confirm is false, i.e. they dont click okay, they click cancel
		button.disabled = false; return; // https://www.w3schools.com/jsref/met_win_confirm.asp, also reenable button if user cancels.
	}
	
	console.log("Deleting project: #" + projectId);
	try {
		const response = await fetch(`https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php`, {
			method: "POST",
			body: new URLSearchParams({
				query: `DELETE FROM tblProject WHERE projectId = ${projectId};`
			})
		});
		
		const result = await response.json();
		console.log(result);
		
		// if succeeds, carry forward with post-deletion "cleanup"
		populateTable(); // redraw table
		closeTabs(); // in case the user is editing say project 60, and deletes project 60, dont let them continue editing project60.
	} catch(e) {
		console.error("Error while deleting: " + e);
		button.disabled = false; // if delete fails, reenable the button. note that it's only reenabled if error fails, cause if delete succeeds, button is gone so no need to reenable its button.
	}
}

function closeTabs() {
	document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
}

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------

function openProjectDetails(projectId) { // cause it's not a link <a> element, it's a button.
	window.open(`projectDetails.html?id=${projectId}`, "_blank"); // https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window?page=1&tab=scoredesc#tab-top https://stackoverflow.com/questions/34082002/html-button-opening-link-in-new-tab
}