console.log("Successfully loaded JS file.");



const runQuery = async (sql) => {
    const output = document.getElementById("output");
    const url = 'https://kgastar01.webhosting1.eeecs.qub.ac.uk/dbConnector.php';

    try{
        const response = await fetch(url, {
            method: "POST",
            body: new URLSearchParams({
                query: sql
            })
        });

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const result = await response.json();
        console.log("RESULT OBJECT:", result);
        console.log("RESULT DATA:", result?.data);
        console.log("RAW:", JSON.stringify(result));
        return result;

        
    } catch (error) {
        output.textContent = error.message;
    }
};


//EVENT LISTENERS

document.addEventListener("DOMContentLoaded", async () => {

    

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    const sql = `SELECT * FROM tblSession WHERE sessionId = ${id}`;
    const result = await runQuery(sql);
    const session = result.data[0];

    if (!session) {
        console.error("No session data found");
        return;
    }

    // populate fields
    document.getElementById("sessionDetailsIDValue").textContent =  session.sessionId;
    document.getElementById("sessionDetailsName").textContent = "Session Name: " +session.sessionName;
    document.getElementById("sessionDetailsType").textContent =  "Session Type: "  +session.sessionType;
    document.getElementById("sessionDetailsAttendance").textContent =  "Attendance Count: " +session.attendanceCount;
    document.getElementById("sessionDetailsBusiness").textContent = "Business ID: "  + session.businessId;
    document.getElementById("sessionDetailsResearcher").textContent =  "Researcher ID: "  +session.researcherId;

    //button clicks

    let researcherVisible = false;
    let businessVisible = false;

    const businessButton = document.getElementById("sessionDetailsBusinessesButton");
    const researcherButton = document.getElementById("sessionDetailsResearchersButton");

    

    researcherButton.addEventListener("click", async () => {

        const tableContainer = document.getElementById("sessionResearcherTable");

        researcherVisible = !researcherVisible;

        tableContainer.style.display = researcherVisible ? "block" : "none";

        if (tableContainer.style.display === "block") {
            await loadResearchers();
        }


    });

    businessButton.addEventListener("click", async () => {

        const tableContainer = document.getElementById("sessionBusinessTable");

        businessVisible = !businessVisible;

        tableContainer.style.display = businessVisible ? "block" : "none";

        if (tableContainer.style.display === "block") {
            await loadBusiness();
        }


    });
});

//LOAD ALL BUSINESSES RELATED TO SESSION
const loadBusiness = async () => {

    const params = new URLSearchParams(window.location.search);
    const sessionId = Number(params.get("id"));

    if (!sessionId) return;

    const sessionResult = await runQuery(
        `SELECT * FROM tblSession WHERE sessionId = ${sessionId}`
    );

    const session = sessionResult.data[0];
    if (!session) return;

    const businessId = Number(session.businessId);
    if (!businessId) return;

    const businessResult = await runQuery(
        `SELECT * FROM tblBusiness WHERE businessId = ${businessId}`
    );

    const rows = businessResult.data;

    printSessionBusinessesTable(rows);
};

//LOAD ALL RESEARCHERS RELATED TO SESSION
const loadResearchers = async () => {

    const params = new URLSearchParams(window.location.search);
    const sessionId = Number(params.get("id"));

    if (!sessionId) return;

    const sessionResult = await runQuery(
        `SELECT * FROM tblSession WHERE sessionId = ${sessionId}`
    );

    const session = sessionResult.data[0];
    if (!session) return;

    const researcherId = session.researcherId;

    if (researcherId === null || researcherId === undefined) {
        console.error("No researcher linked to session");
        return;
    }

    const researcherResult = await runQuery(
        `SELECT * FROM tblResearcher WHERE researcherId = ${researcherId}`
    );

    console.log("SESSION:", session);
    console.log("RESEARCHER ID:", session.researcherId);
    const rows = researcherResult.data;


    printSessionResearchersTable(rows);
};



//CREATE BUSINESSES TABLE
const printSessionBusinessesTable = (rows) => {

    const output = document.getElementById("sessionBusinessTable");
    output.innerHTML = "";

    const table = document.createElement("table");

    const headers = ["Business ID", "Name", "Sustainability goal date", "Sustainability status", "Sustainability goal", "Business email", "Business telephone", 
        "Opening date", "Sustainability goal reached", "Postcode"
    ];

    const headerRow = document.createElement("tr");

    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

   rows.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${row.businessId}</td>
        <td>${row.businessName}</td>
        <td>${row.sustainabilityGoalDate}</td>
        <td>${row.sustainabilityStatus}</td>
        <td>${row.sustainabilityGoal}</td>
        <td>${row.businessEmail}</td>
        <td>${row.businessTelephone}</td>
        <td>${row.openingDate}</td>
        <td>${row.sustainabilityGoalReached}</td>
        <td>${row.postCode}</td>
    `;

    table.appendChild(tr);
});

    output.appendChild(table);

}

//CREATE RESEARCHERS TABLE
const printSessionResearchersTable = (rows) => {

    const output = document.getElementById("sessionResearcherTable");
    output.innerHTML = "";

    const table = document.createElement("table");

    const headers = ["Researcher ID", "Researcher Forename", "Researcher Surname", "Role",
        "Area Of Expertise", "Researcher Email", "Researcher Telephone"

    ];

    const headerRow = document.createElement("tr");

    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

   rows.forEach(row => {
    const tr = document.createElement("tr");

    

    tr.innerHTML = `
        <td>${row.researcherId}</td>
        <td>${row.researcherForename}</td>
        <td>${row.researcherSurname}</td>
        <td>${row.researcherRole}</td>
        <td>${row.areaOfExpertise}</td>
        <td>${row.researcherEmail}</td>
        <td>${row.researcherTelephone}</td>
        
    `;

    table.appendChild(tr);
});

    output.appendChild(table);

}
