document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");
    initializeTable();
    initiliazeDetails();
});

async function initializeTable() {
    const params = new URLSearchParams(window.location.search);
    const publicationId = params.get("publicationId")
    const researchers = (await returnResearchers(publicationId)).data;
    populateTable(researchers);
}

async function initiliazeDetails(){
    const params = new URLSearchParams(window.location.search);
    const publicationId = params.get("publicationId")
    const result = await returnSpecificPublication(publicationId);
    document.getElementById("detail-display").textContent = result.data[0].publicationTitle;
    document.getElementById("ID").textContent = "Publication ID: " + result.data[0].publicationId;
    document.getElementById("details").textContent = "Publication Details: " + result.data[0].publicationDetails;
    document.getElementById("summary").textContent = "Publication Summary: " + result.data[0].publicationSummary;
    document.getElementById("date").textContent = "Publication Date: " + result.data[0].publicationDate;

}

function populateTable(researchers) {
    const table = document.getElementById("researcherTable");

    researchers.forEach(r => {
        const row = table.insertRow();

        row.insertCell().textContent = r.researcherId;
        row.insertCell().textContent = r.researcherForename + " " + r.researcherSurname;
        row.insertCell().textContent = r.researcherEmail;
        row.insertCell().textContent = r.researcherTelephone;
        row.insertCell().textContent = r.researcherRole;
        row.insertCell().textContent = r.areaOfExpertise;
    });
}

const returnSpecificPublication = async (id) => {
    const sql = `SELECT * FROM tblPublication WHERE publicationId = '${id}';`;
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();

    } catch (err) {
        console.error("Error while fetching publication:", err);
        return null;
    }
};


const returnResearchers = async (id) => { //ADD ID
    const sql = "SELECT tblResearcher.researcherId, researcherForename, researcherSurname, researcherEmail, researcherTelephone, researcherRole, areaOfExpertise FROM tblResearcher INNER JOIN tblResearcherPublication ON tblResearcher.researcherId = tblResearcherPublication.researcherId WHERE tblResearcherPublication.publicationId = " + id + ";";
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );
        if (!response.ok)throw new Error(`Server error: ${response.status}`);
        return await response.json();

    } catch (err) {
        console.error("Error while fetching researchers:", err);
        return null;
    }
};