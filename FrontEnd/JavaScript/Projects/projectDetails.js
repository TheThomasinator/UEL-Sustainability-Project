document.addEventListener("DOMContentLoaded", async () => {
	const params = new URLSearchParams(window.location.search); // as used in other pages
	const projectId = params.get("id");
	await populatePage(projectId);
	
	setupToggle("#researchers-toggle", "#pd-researchersTable");
	setupToggle("#sessions-toggle", "#pd-sessionsTable");
	setupToggle("#publications-toggle", "#pd-publicationsTable");
});

async function populatePage(projectId) {
	// project info
	await populateProjectDetails(projectId);
	
	// partner info
	await populatePartnerDetails(projectId);
	
	// researchers
	await populateResearchersDetails(projectId);
	
	// sessions
	await populateSessionsDetails(projectId);
	
	// publications
	await populatePublicationsDetails(projectId);
	
	// chart
	await drawSessionTypesChart(projectId);
}

function setupToggle(buttonId, tableId) { // versatile function for the 3 tables in the page
	const btn = document.querySelector(buttonId);
	const table = document.querySelector(tableId);
	
	btn.addEventListener("click", () => {
		const isHidden = table.style.display === "none";
		
		table.style.display = isHidden ? "table" : "none";
		btn.textContent = isHidden ? "Hide Table ▲" : "Show Table ▼";
	});
}

async function fetchProjectDetails(projectId) {
	const projectDetailsQuery = `SELECT 
		pr.projectTitle,
		pr.projectStartDate,
		pr.projectLengthDays,
		pr.projectSummary,
		
		DATE_ADD(pr.projectStartDate, INTERVAL pr.projectLengthDays DAY) AS projectEndDate,
		
		CASE
			WHEN CURDATE() < pr.projectStartDate THEN 'Not Started'
			WHEN CURDATE() BETWEEN pr.projectStartDate 
				AND DATE_ADD(pr.projectStartDate, INTERVAL pr.projectLengthDays DAY) THEN 'Ongoing'
			ELSE 'Completed'
		END AS projectStatus,
		
		ABS(DATEDIFF(pr.projectStartDate, CURDATE())) AS daysUntilStart,
		
		DATEDIFF(
			DATE_ADD(pr.projectStartDate, INTERVAL pr.projectLengthDays DAY),
			CURDATE()
		) AS daysUntilEnd
		
		FROM tblProject pr
		WHERE pr.projectId = ${projectId};`;
		// https://www.w3schools.com/sql/func_mysql_date_add.asp
		// https://www.w3schools.com/sql/sql_case.asp
		// https://www.w3schools.com/sql/func_mysql_curdate.asp
		// https://www.w3schools.com/sql/func_mysql_datediff.asp
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: projectDetailsQuery
			})
		});
		
		const result = await response.json();
		console.log("Project Details: " + result);
		
		return result.data;
	} catch (err) {
		console.error(err);
	}
}
async function populateProjectDetails(projectId) {
	const data = await fetchProjectDetails(projectId); // need asynchonicity (if that's the word) because without, variable is undefined, because it doesnt wait for the method fully.
	const project = data[0];
	
	// basic info
	// note, im using innerHTML cause im inadvertently deleting the <strong> in the paragraph elements, so i wanna put them back:
	document.getElementById("pd-projectTitle").innerHTML = "<strong>Project Title: </strong>" + project.projectTitle;
	document.getElementById("pd-projectSummary").innerHTML = "<strong>Summary: </strong>" + project.projectSummary;
	
	// dates stuff
	const options = { // https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	const startDate = new Date(project.projectStartDate);
	const endDate = new Date(project.projectEndDate);
	document.getElementById("pd-startDate").innerHTML = "<strong>Start Date: </strong>" + startDate.toLocaleDateString("en-GB", options);
	document.getElementById("pd-endDate").innerHTML = "<strong>Estimated End Date: </strong>" + endDate.toLocaleDateString("en-GB", options);
	document.getElementById("pd-length").innerHTML = "<strong>Estimated Length (days): </strong>" + project.projectLengthDays;
	
	// status of project
	document.getElementById("pd-status").innerHTML = "<strong>Status: </strong>" + project.projectStatus;
	
	// derived fields
	const daysUntilStart = document.getElementById("pd-daysUntilStart");
	const daysUntilEnd = document.getElementById("pd-daysUntilEnd");
	// reset first:
	daysUntilStart.innerHTML = "";
	daysUntilEnd.innerHTML = "";
	// & set:
	if (project.projectStatus === "Not Started") daysUntilEnd.innerHTML = "<strong>Days until start: </strong>" + project.daysUntilStart;
	else if (project.projectStatus === "Ongoing") {
		daysUntilStart.innerHTML = "<strong>Days since start: </strong>" + project.daysUntilStart;
		daysUntilEnd.innerHTML = "<strong>Days until estimated end: </strong>" + project.daysUntilEnd;
	}
	else if (project.projectStatus === "Completed") daysUntilStart.innerHTML = "<strong>Total duration (days): </strong>" + project.projectLengthDays;
}

async function fetchPartnerDetails(projectId) {
	const partnerDetailsQuery = `SELECT 
		pa.partnerName,
		pa.sector,
		pa.partnerAidDesc,
		ar.areaName
		
		FROM tblProject pr
		JOIN tblPartner pa ON pr.partnerId = pa.partnerId
		JOIN tblArea ar ON pa.postCode = ar.postCode
		WHERE pr.projectId = ${projectId};`;
	
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: partnerDetailsQuery
			})
		});
		
		const result = await response.json();
		console.log("Partner details: ", result);
		return result.data;
	} catch (e) {
		console.error(e);
	}
}
async function populatePartnerDetails(projectId) {
	const data = await fetchPartnerDetails(projectId);
	const partner = data[0];
	
	// fill in elements
	document.getElementById("pd-partnerName").innerHTML = "<strong>Partner Name: </strong>" + partner.partnerName;
	document.getElementById("pd-partnerSector").innerHTML = "<strong>Sector: </strong>" + partner.sector;
	document.getElementById("pd-partnerAid").innerHTML = "<strong>Aid Description: </strong>" + partner.partnerAidDesc;
	document.getElementById("pd-partnerArea").innerHTML = "<strong>Area: </strong>" + partner.areaName;
}

async function fetchProjectResearchers(projectId) {
	const projectResearchersQuery = `SELECT 
		r.researcherForename,
		r.researcherSurname,
		r.researcherRole,
		r.areaOfExpertise,
		r.researcherEmail
		FROM tblProject pr
		JOIN tblResearcherProject rp ON pr.projectId = rp.projectId
		JOIN tblResearcher r ON rp.researcherId = r.researcherId
		WHERE pr.projectId = ${projectId}
		ORDER BY r.researcherSurname, r.researcherForename;`;
	
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: projectResearchersQuery
			})
		});
		
		const result = await response.json();
		console.log("Researchers: ", result);
		return result.data;
	} catch (e) {
		console.error(e);
	}
}
async function populateResearchersDetails(projectId) {
	const data = await fetchProjectResearchers(projectId);
	const tableBody = document.querySelector("#pd-researchersTable tbody"); // queryselector really is pretty powerful https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
	
	let tbodyHTMLToAdd = "";
	data.forEach(researcher => {
		tbodyHTMLToAdd += `
			<tr>
				<td>${researcher.researcherForename} ${researcher.researcherSurname}</td>
				<td>${researcher.researcherRole}</td>
				<td>${researcher.areaOfExpertise}</td>
				<td>${researcher.researcherEmail}</td>
			</tr>`;
	});
	
	tableBody.innerHTML = tbodyHTMLToAdd;
}

async function fetchProjectSessions(projectId) {
	const sessionsDetailsQuery = `SELECT 
		s.sessionName,
		s.sessionType,
		s.attendanceCount,
		b.businessName,
		r.researcherForename,
		r.researcherSurname
		FROM tblProject pr
		JOIN tblResearcherProject rp ON pr.projectId = rp.projectId
		JOIN tblResearcher r ON rp.researcherId = r.researcherId
		JOIN tblSession s ON r.researcherId = s.researcherId
		JOIN tblBusiness b ON s.businessId = b.businessId
		WHERE pr.projectId = ${projectId}
		ORDER BY s.sessionName;`; // including name of business attending the session
	
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: sessionsDetailsQuery
			})
		});
		
		const result = await response.json();
		console.log("Sessions:", result);
		return result.data;
	} catch (e) {
		console.error(e);
	}
}
async function populateSessionsDetails(projectId) {
	const data = await fetchProjectSessions(projectId);
	const tableBody = document.querySelector("#pd-sessionsTable tbody");
	
	let tbodyHTMLToAdd = "";
	data.forEach(session => {
		tbodyHTMLToAdd += `
			<tr>
				<td>${session.sessionName}</td>
				<td>${session.sessionType}</td>
				<td>${session.attendanceCount}</td>
				<td>${session.businessName}</td>
				<td>${session.researcherForename} ${session.researcherSurname}</td>
			</tr>`;
	});
	
	tableBody.innerHTML = tbodyHTMLToAdd;
}

async function fetchProjectResearchersPublications(projectId) {
	const theQuery = `SELECT 
		p.publicationTitle,
		p.publicationDate,
		p.publicationSummary,
		r.researcherForename,
		r.researcherSurname
		FROM tblProject pr
		JOIN tblResearcherProject rp ON pr.projectId = rp.projectId
		JOIN tblResearcher r ON rp.researcherId = r.researcherId
		JOIN tblResearcherPublication rpub ON r.researcherId = rpub.researcherId
		JOIN tblPublication p ON rpub.publicationId = p.publicationId
		WHERE pr.projectId = ${projectId}
		ORDER BY r.researcherId, p.publicationDate ASC;`; // ordering by researcher, and then the dates.
	
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: theQuery
			})
		});
		
		const result = await response.json();
		console.log("Publications:", result);
		return result.data;
	} catch (e) {
		console.error(e);
	}
}
async function populatePublicationsDetails(projectId) {
	const data = await fetchProjectResearchersPublications(projectId);
	const tableBody = document.querySelector("#pd-publicationsTable tbody");
	
	let tbodyHTMLToAdd = "";
	data.forEach(p => {
		const formattedDate = new Date(p.publicationDate).toLocaleDateString("en-GB");
		tbodyHTMLToAdd += `
			<tr>
				<td>${p.publicationTitle}</td>
				<td>${formattedDate}</td>
				<td>${p.publicationSummary}</td>
				<td>${p.researcherForename} ${p.researcherSurname}</td>
			</tr>`;
	});
	
	tableBody.innerHTML = tbodyHTMLToAdd;
}

async function fetchSessionTypesData(projectId) {
	// fetch data:
	const sessionTypesQuery = `SELECT 
			s.sessionType,
			COUNT(*) AS sessionCount
		FROM tblProject pr
		JOIN tblResearcherProject rp ON pr.projectId = rp.projectId
		JOIN tblResearcher r ON rp.researcherId = r.researcherId
		JOIN tblSession s ON r.researcherId = s.researcherId
		WHERE pr.projectId = ${projectId}
		GROUP BY s.sessionType;`;
	
	try {
		const response = await fetch('https://jdabrowski01.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
			method: "POST",
			body: new URLSearchParams({
				query: sessionTypesQuery
			})
		});
		
		const result = await response.json();
		console.log("Session Types:", result);
		let online = 0, inPerson = 0, hybrid = 0;
		
		result.data.forEach(row => {
			if (row.sessionType === "Online") online = row.sessionCount;
			if (row.sessionType === "In-person") inPerson = row.sessionCount;
			if (row.sessionType === "Hybrid") hybrid = row.sessionCount;
		});
		
		return [online, inPerson, hybrid];
	} catch (e) {
		console.error(e);
	}
	
	return [onlineCount, inPersonCount, hybridCount];
}
async function drawSessionTypesChart(projectId) {
	// https://www.chartjs.org/docs/latest/general/data-structures.html
	// https://www.w3schools.com/js/js_graphics_chartjs.asp
	const ctx = document.getElementById("pd-sessions-types-chart");
	const resultingCounts = await fetchSessionTypesData(projectId);
	
	const myChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ["Online", "In-Person", "Hybrid"], // 
			datasets: [{
				label: "Session Types", // for the dataset
				data: resultingCounts, // actual data to be shown belongs here
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)'
				],
				borderWidth: 1
			}]
		},
		options: { // https://stackoverflow.com/questions/19847582/chart-js-canvas-resize
			responsive: true,
			maintainAspectRatio: false
		}
	});
}