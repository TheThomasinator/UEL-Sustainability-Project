console.log("Script Loaded...")

const researcherId = localStorage.getItem("selectedResearcherId");
console.log("Loaded researcher ID:", researcherId);

const loadResearcher = async () => {
    const sql = `SELECT * FROM tblResearcher WHERE researcherId = ${researcherId}`

    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    const data = result.data[0];

    document.getElementById("researcherForename").innerText = `Forename: ${data.researcherForename}`
    document.getElementById("researcherSurname").innerText = `Surname: ${data.researcherSurname}`
    document.getElementById("researcherRole").innerText = `Role: ${data.researcherRole}`
    document.getElementById("researcherAreaOfExpertise").innerText = `Area Of Expertise: ${data.areaOfExpertise}`
    document.getElementById("researcherEmail").innerText = `Email: ${data.researcherEmail}`
    document.getElementById("researcherTelephone").innerText = `Telephone: ${data.researcherTelephone}`
}

document.addEventListener("DOMContentLoaded", loadResearcher);

const projectTable = async () => {
    const sql = `SELECT p.* FROM tblProject p JOIN tblResearcherProject rp ON p.projectId = rp.projectId WHERE rp.researcherId = ${researcherId}`

    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    const data = result.data;

    const container = document.getElementById("researcherProjectsTable");

    if (data.length === 0) {
        container.textContent = "This researcher isn't involved in any projects.";
        return;
    }

    let html = "<table border = 1><tr>";

    const columns = Object.keys(data[0]);

    html += "<tr><th>Project ID</th>"
    html += "<th>Project Title</th>"
    html += "<th>Start Date</th>"
    html += "<th>Length (Days)</th>"
    html += "<th>Summary</th>"
    html += "<th>Partner ID</th>"
    html += "</tr>";

    data.forEach(row => {
        html += "<tr>";
        columns.forEach(col => {
            html += `<td>${row[col]}</td>`;
        })
        html += "</tr>";
    });

    html += "</table>";
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", projectTable);

const publicationsTable = async () => {
    const sql = `SELECT p.* FROM tblPublication p JOIN tblResearcherPublication rp ON p.publicationId = rp.publicationId WHERE rp.researcherId = ${researcherId}`

    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    const data = result.data;

    const container = document.getElementById("researcherPublicationsTable");

    if (data.length === 0) {
        container.textContent = "This researcher isn't involved in any publications.";
        return;
    }

    let html = "<table border = 1><tr>";

    const columns = Object.keys(data[0]);

    html += "<tr><th>Publication ID</th>"
    html += "<th>Publication Title</th>"
    html += "<th>Publication Details</th>"
    html += "<th>Publication Date</th>"
    html += "<th>Summary</th>"
    html += "</tr>";

    data.forEach(row => {
        html += "<tr>";
        columns.forEach(col => {
            html += `<td>${row[col]}</td>`;
        })
        html += "</tr>";
    });

    html += "</table>";
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", publicationsTable);

const sessionTable = async () => {
    const sql = `SELECT * FROM tblSession WHERE researcherId = ${researcherId}`

    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    const data = result.data;

    const container = document.getElementById("researcherSessionsTable");

    if (data.length === 0) {
        container.textContent = "This researcher isn't involved in any sessions.";
        return;
    }

    let html = "<table border = 1><tr>";

    const columns = Object.keys(data[0]);

    html += "<tr><th>Session ID</th>"
    html += "<th>Session Title</th>"
    html += "<th>Session Type</th>"
    html += "<th>Attendance</th>"
    html += "<th>Business ID</th>"
    html += "<th>Researcher ID</th>"
    html += "</tr>";

    data.forEach(row => {
        html += "<tr>";
        columns.forEach(col => {
            html += `<td>${row[col]}</td>`;
        })
        html += "</tr>";
    });

    html += "</table>";
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", sessionTable);