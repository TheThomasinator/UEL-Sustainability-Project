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
        return result;

        
    } catch (error) {
        console.error("runQuery error:", error);

        if (output) {
            output.textContent = error.message;
        }

        return {
            success: false,
            data: []
        };
    }
};

/* Retrieve data for comboboxes */
const returnBusinessIds = async () => {

    const sql = "SELECT businessId FROM tblBusiness ORDER BY businessId ASC";

    try{

        const result = await runQuery(sql);

        return result;
    }
    catch{

        console.error("Failed to retrieve  business Ids.");
        return null;
    }
}

const returnResearcherIds = async () => {

    const sql = "SELECT researcherId FROM tblResearcher ORDER BY researcherId ASC";

    try{

        const result = await runQuery(sql);

        return result;
    }
    catch{

        console.error("Failed to retrieve  researcher Ids.");
        return null;
    }
}

const returnSessionIds = async () => {

    const sql = "SELECT sessionId FROM tblSession ORDER BY sessionId ASC";

    try{

        const result = await runQuery(sql);

        return result;
    }
    catch{

        console.error("Failed to retrieve  session Ids.");
        return null;
    }
}

const returnSelectedSession = async (value) => {

    console.log("Successfully retrieved selected session Data.");
    const sql = `SELECT * FROM tblSession WHERE sessionId = ${value}`;

     try{

        const result = await runQuery(sql);

        return result.data[0];
    }
    catch{

        console.error("Failed to retrieve selected session data.");
        return null;
    }
}



/*populate comboboxes upon tab change*/
const loadAddSessionData = async () => {

    console.log("Populated Add Session Comboboxes");

    const businessIds = (await returnBusinessIds()).data;
    const researcherIds = (await returnResearcherIds()).data;

    const businessCbx1 = document.getElementById("addBusinessID");
    const researcherCbx1 = document.getElementById("addResearcherID");

    businessCbx1.innerHTML = "";
    researcherCbx1.innerHTML = "";
    

    for (let i = 0; i < businessIds.length; i++) {

        const businessIdOption = document.createElement("option");
        businessIdOption.value = businessIds[i].businessId;
        businessIdOption.textContent = businessIds[i].businessId;

        businessCbx1.add(businessIdOption);
        

    }

    for (let i = 0; i < researcherIds.length; i++) {

        const researcherIdOption = document.createElement("option");
        researcherIdOption.value = researcherIds[i].researcherId;
        researcherIdOption.textContent = researcherIds[i].researcherId;

        researcherCbx1.add(researcherIdOption);
        
    }
}

const loadEditSessionData = async () => {

    console.log("Populated Edit Session Comboboxes");

    const sessionIds = (await returnSessionIds()).data;
    const businessIds = (await returnBusinessIds()).data;
    const researcherIds = (await returnResearcherIds()).data;

    const sessionCbx = document.getElementById("editSessionID");
    const businessCbx = document.getElementById("editBusinessID");
    const researcherCbx = document.getElementById("editResearcherID");

    sessionCbx.select = "";
    businessCbx.select = "";
    researcherCbx.select = "";
    

     for (let i = 0; i < sessionIds.length; i++) {

        const sessionIdOption = document.createElement("option");
        sessionIdOption.value = sessionIds[i].sessionId;
        sessionIdOption.textContent = sessionIds[i].sessionId;

        sessionCbx.add(sessionIdOption);
        

    }

    for (let i = 0; i < businessIds.length; i++) {

        const businessIdOption = document.createElement("option");
        businessIdOption.value = businessIds[i].businessId;
        businessIdOption.textContent = businessIds[i].businessId;

        businessCbx.add(businessIdOption);
        

    }

    for (let i = 0; i < researcherIds.length; i++) {

        const researcherIdOption = document.createElement("option");
        researcherIdOption.value = researcherIds[i].researcherId;
        researcherIdOption.textContent = researcherIds[i].researcherId;

        researcherCbx.add(researcherIdOption);
        
    }
}

const loadDeleteSessionData = async () => {

    console.log("Populated Delete Session Comboboxes");

    const sessionIds = (await returnSessionIds()).data;
    const businessIds = (await returnBusinessIds()).data;
    const researcherIds = (await returnResearcherIds()).data;

    const sessionCbx = document.getElementById("deleteSessionID");
    const businessCbx = document.getElementById("deleteBusinessID");
    const researcherCbx = document.getElementById("deleteResearcherID");

    sessionCbx.select = "";
    businessCbx.select = "";
    researcherCbx.select = "";
    

     for (let i = 0; i < sessionIds.length; i++) {

        const sessionIdOption = document.createElement("option");
        sessionIdOption.value = sessionIds[i].sessionId;
        sessionIdOption.textContent = sessionIds[i].sessionId;

        sessionCbx.add(sessionIdOption);
        

    }

    for (let i = 0; i < businessIds.length; i++) {

        const businessIdOption = document.createElement("option");
        businessIdOption.value = businessIds[i].businessId;
        businessIdOption.textContent = businessIds[i].businessId;

        businessCbx.add(businessIdOption);
        

    }

    for (let i = 0; i < researcherIds.length; i++) {

        const researcherIdOption = document.createElement("option");
        researcherIdOption.value = researcherIds[i].researcherId;
        researcherIdOption.textContent = researcherIds[i].researcherId;

        researcherCbx.add(researcherIdOption);
        
    }
}



/*Return data of selected Session */
const getSelectedSessionEDIT = async () => {

   
    const id = document.getElementById("editSessionID").value;

    if(!id) 
        return;

    const session = await returnSelectedSession(id);

    if (!session)
        return;

    document.getElementById("editSessionName").value = session.sessionName;
    document.getElementById("editSessionType").value = session.sessionType;
    document.getElementById("editAttendanceCount").value = session.attendanceCount;
    document.getElementById("editBusinessID").value = session.businessId;
    document.getElementById("editResearcherID").value = session.researcherId;


 console.log("Retrieved selected session data");    
}

const getSelectedSessionDELETE = async () => {

   
    const id = document.getElementById("deleteSessionID").value;

    if(!id) 
        return;

    const session = await returnSelectedSession(id);

    if (!session)
        return;

    document.getElementById("deleteSessionName").value = session.sessionName;
    document.getElementById("deleteSessionType").value = session.sessionType;
    document.getElementById("deleteAttendanceCount").value = session.attendanceCount;
    document.getElementById("deleteBusinessID").value = session.businessId;
    document.getElementById("deleteResearcherID").value = session.researcherId;


 console.log("Retrieved selected session data");    
}



/*sessions Table*/

let renderId = 0;

const printTable = async () => {

    const currentRender = ++renderId;


    //referenced as sessionTable in css
    const output = document.querySelector("#sessionTable");
    console.log("sessionTable element:", output);
    output.innerHTML = "";

    if (!output) {
    console.error("sessionTable not found");
    return;
}

    //sql used
    const sql = "SELECT * FROM tblSession;";
    //call the runQuery function to initiate connection with the given sql
    const result = await runQuery(sql);

    //prevents glitch of duplicate rows from appearing
    if (currentRender !== renderId) return;


    //create the rows based on the data retrieved
    const rows = result.data;

    let filteredRows = rows;

    //filter function for session type
    const selectedType = document.getElementById("sessionType").value;
    const selectedId = document.getElementById("sessionId").value;
    const selectedName = document.getElementById("sessionName").value;
    const selectedAttendanceCount = document.getElementById("attendanceCount").value;
    const selectedBusinessId = document.getElementById("sessionBusinessId").value;
    const selectedResearcherId = document.getElementById("sessionResearcherId").value;

    

    if (selectedType !== "All") {
        filteredRows = filteredRows.filter(row =>
            row.sessionType &&
            row.sessionType.toLowerCase() === selectedType.toLowerCase()
        );
    }

     if (selectedId !== "") {
        filteredRows = filteredRows.filter(row =>
            row.sessionId &&
            String(row.sessionId) === selectedId
        );
    }

    if (selectedName !== "") {
        filteredRows = filteredRows.filter(row =>
            row.sessionName &&
            row.sessionName.toLowerCase().includes(selectedName.toLowerCase())
        );
    }

    if (selectedAttendanceCount !== "") {
        filteredRows = filteredRows.filter(row =>
            row.attendanceCount &&
            row.attendanceCount === Number(selectedAttendanceCount)
        );
    }

    if (selectedBusinessId !== "") {
        filteredRows = filteredRows.filter(row =>
            row.businessId &&
            row.businessId === selectedBusinessId
        );
    }

    if (selectedResearcherId !== "") {
        filteredRows = filteredRows.filter(row =>
            row.researcherId &&
            row.researcherId === selectedResearcherId
        );
    }

    //if no rows have been created, set text to no data found
    if (!filteredRows || filteredRows.length === 0) {
        output.textContent = "No data found";
        return;
    }
    //create a table
    const table = document.createElement("table");
    

    // HEADER
    const headerRow = document.createElement("tr");

    //create the headers
    const headers = [
        "Session ID",
        "Name",
        "Type",
        "Attendance Count",
        "Business ID",
        "Researcher ID"
    ];

    //create header cells for each header and append
    headers.forEach(text => {
        const th = document.createElement("th");
        //insert the text into each header cell
        th.textContent = text;
        //add each header cell into the header row
        headerRow.appendChild(th);
    });

    //add the header row into the table
    table.appendChild(headerRow);

    // DATA ROWS
    filteredRows.forEach(row => {
        const tr = document.createElement("tr");

        tr.classList.add("table-row");

        //make row clickable
        tr.style.cursor = "pointer";

        //event listener for row click and saving session details
       tr.addEventListener("click", () => {
    console.log("CLICKED ROW:", row);

    localStorage.setItem("selectedSession", JSON.stringify(row));

    console.log("STORED:", localStorage.getItem("selectedSession"));

    window.location.href = `sessionDetails.html?id=${row.sessionId}`;
});

        tr.innerHTML = `
            <td>${row.sessionId}</td>
            <td>${row.sessionName}</td>
            <td>${row.sessionType}</td>
            <td>${row.attendanceCount}</td>
            <td>${row.businessId}</td>
            <td>${row.researcherId}</td>
        `;

        table.appendChild(tr);
    });



    output.appendChild(table);

    console.log(rows[0]);
    
};





/*SESSION AED*/

//ADD SESSION
const addSession = async () => {

    const type = document.getElementById("addSessionType").value;
    const name = document.getElementById("addSessionName").value;
    const attendanceCount = document.getElementById("addAttendanceCount").value;
    const businessId = document.getElementById("addBusinessID").value;
    const researcherId = document.getElementById("addResearcherID").value;

    if (!validateSessionName(name)){
        alert("Invalid session name: Must not be empty & max of 50 characters.");
        return;
    }

    if (!validateSessionType(type)){
        alert("Invalid session type: Must not be empty & must be a valid session type.");
        return;
    }

    if (!validateAttendance(attendanceCount)){
        alert("Invalid attendance count: Must be a valid positive integer.");
        return;
    }

    if (!validateBusinessId(businessId)){
        alert("Invalid business Id: Cannot be empty & must be a valid business Id.");
        return;
    }

    if (!validateResearcherId(researcherId)){
        alert("Invalid researcher Id: Cannot be empty & must be a valid researcher Id.");
        return;
    }

    const sql = `
        INSERT INTO tblSession 
        (sessionName, sessionType, attendanceCount, businessId, researcherId)
        VALUES ('${name}', '${type}', ${attendanceCount}, ${businessId}, ${researcherId})
    `;

    await runQuery(sql);
    alert("Session has been added.");

    //refresh table
   setTimeout(printTable, 0);
   location.reload();
    


}

//EDIT SESSION
const editSession = async () => {

    const id = document.getElementById("editSessionID").value;
    const type = document.getElementById("editSessionType").value;
    const name = document.getElementById("editSessionName").value;
    const attendanceCount = document.getElementById("editAttendanceCount").value;
    const businessId = document.getElementById("editBusinessID").value;
    const researcherId = document.getElementById("editResearcherID").value;

    if (!validateSessionName(name)){
        alert("Invalid session name: Must not be empty & max of 50 characters.");
        return;
    }

    if (!validateSessionType(type)){
        alert("Invalid session type: Must not be empty & must be a valid session type.");
        return;
    }

    if (!validateAttendance(attendanceCount)){
        alert("Invalid attendance count: Must be a valid positive integer.");
        return;
    }

    if (!validateBusinessId(businessId)){
        alert("Invalid business Id: Cannot be empty & must be a valid business Id.");
        return;
    }

    if (!validateResearcherId(researcherId)){
        alert("Invalid researcher Id: Cannot be empty & must be a valid researcher Id.");
        return;
    }

   const sql = `
        UPDATE tblSession
        SET sessionName = '${name}',
            sessionType = '${type}',
            businessId = '${businessId}',
            researcherId = '${researcherId}',
            attendanceCount = ${attendanceCount}
        WHERE sessionId = ${id}
    `;

    await runQuery(sql);
    alert("Session has been Updated.");

    //refresh table
   setTimeout(printTable, 0);
   location.reload();
    


}

//DELETE SESSION
const deleteSession = async () => {

    const id = document.getElementById("deleteSessionID").value;
    const type = document.getElementById("deleteSessionType").value;
    const name = document.getElementById("deleteSessionName").value;
    const attendanceCount = document.getElementById("deleteAttendanceCount").value;
    const businessId = document.getElementById("deleteBusinessID").value;
    const researcherId = document.getElementById("deleteResearcherID").value;

    if (!validateSessionName(name)){
        alert("Invalid session name: Must not be empty & max of 50 characters.");
        return;
    }

    if (!validateSessionType(type)){
        alert("Invalid session type: Must not be empty & must be a valid session type.");
        return;
    }

    if (!validateAttendance(attendanceCount)){
        alert("Invalid attendance count: Must be a valid positive integer.");
        return;
    }

    if (!validateBusinessId(businessId)){
        alert("Invalid business Id: Cannot be empty & must be a valid business Id.");
        return;
    }

    if (!validateResearcherId(researcherId)){
        alert("Invalid researcher Id: Cannot be empty & must be a valid researcher Id.");
        return;
    }

     const confirmDelete = confirm("Are you sure you want to delete this session?");

    if (!confirmDelete) {
        return; 
    }

    const sql = `DELETE FROM tblSession WHERE sessionId = ${id}`;

    await runQuery(sql);
    alert("Session has been deleted.");

    //refresh table
   setTimeout(printTable, 0);
   location.reload();
    


}











/* Event listeners */

//create table when web page is opened.
document.addEventListener("DOMContentLoaded", () => {
    printTable();
    loadSessionChart();

    document.getElementById("sessionType")
        .addEventListener("change", printTable);
    document.getElementById("sessionId")
        .addEventListener("input", printTable);
    document.getElementById("sessionName")
        .addEventListener("input", printTable);
    document.getElementById("attendanceCount")
        .addEventListener("input", printTable);
    document.getElementById("sessionBusinessId")
        .addEventListener("input", printTable);
    document.getElementById("sessionResearcherId")
        .addEventListener("input", printTable);

    //reset form inputs when refreshing page
    document.getElementById("sessionsForm").reset();
    document.getElementById("sessionTabForms").reset();
    resetSessionForm();

    //aed buttons
    document.getElementById("addSessionButton").addEventListener("click", addSession);
    document.getElementById("editSessionButton").addEventListener("click", editSession);
    document.getElementById("deleteSessionButton").addEventListener("click", deleteSession);

    document.getElementById("editSessionID").addEventListener("change", getSelectedSessionEDIT);
    document.getElementById("deleteSessionID").addEventListener("change", getSelectedSessionDELETE);

    const toggleBtn = document.getElementById("showSessionTableButton");

    let rowsVisible = false;

    toggleBtn.addEventListener("click", () => {
        const rows = document.querySelectorAll(".table-row");

        rowsVisible = !rowsVisible;

        rows.forEach(row => {
            row.style.display = rowsVisible ? "none" : "table-row";
        });

        toggleBtn.textContent = rowsVisible ? "Expand Table" : "Collapse Table";
    });

    


});


/*FIELD VALIDATION*/

//not empty
const isNotEmpty = value =>
    value.trim() !== "";

//valid number
const isNumber = value =>
    !isNaN(value) && value !== "";

//positive number
const isPositive = value =>
    Number(value) > 0;

const maxLength = (value, length) =>
    value.length <= length;

const types = [
    "Online",
    "In-person",
    "Hybrid"
];

const validType = value =>
    types.includes(value);
   
    

//validate session name - not empty and max length of 50
const validateSessionName = sessionName => {
    return isNotEmpty(sessionName) && maxLength(sessionName, 50);
};

//validate session Type - not empty and valid session type
const validateSessionType = type => {
    return isNotEmpty(type) && validType(type);
} 

//validate attendance count - not 0 or less than 0,  and is a number
const validateAttendance = count => {
    return isNotEmpty(count) && isNumber(count) && isPositive(count);
}

//validate business Id - valid number and cannot be empty
const validateBusinessId = id => {
    return isNotEmpty(id) && isNumber(id);
}

//validate researcher Id - valid number and cannot be empty
const validateResearcherId = id => {
    return isNotEmpty(id) && isNumber(id);
}



//RESET AED INPUTS MANUALLY
const resetSessionForm = () => {
    document.getElementById("addSessionName").value = "";
    document.getElementById("addSessionType").value = "Online";
    document.getElementById("addAttendanceCount").value = "";
    document.getElementById("addBusinessID").value = "";
    document.getElementById("addResearcherID").value = "";

    document.getElementById("editSessionID").value = "";
    document.getElementById("editSessionName").value = "";
    document.getElementById("editSessionType").value = "Online";
    document.getElementById("editAttendanceCount").value = "";
    document.getElementById("editBusinessID").value = "";
    document.getElementById("editResearcherID").value = "";

    document.getElementById("deleteSessionID").value = "";
    document.getElementById("deleteSessionName").value = "";
    document.getElementById("deleteSessionType").value = "Online";
    document.getElementById("deleteAttendanceCount").value = "";
    document.getElementById("deleteBusinessID").value = "";
    document.getElementById("deleteResearcherID").value = "";
};

//chart code
const loadSessionChart = async () => {

    const sql = `SELECT * FROM tblSession`;
    const result = await runQuery(sql);

    const rows = result.data || [];

    if (!rows.length) {
        console.log("No data for chart");
        return;
    }

    const count = {};

    rows.forEach(r => {

        //get session type
        const type = r.sessionType;

        //if session type doesnt exist inside count, create and initialise as 0
        if (!count[type]) {
            count[type] = 0;
        }

        //add the attendance count to that type
        count[type] += Number(r.attendanceCount);
    });


    const labels = Object.keys(count);
    const data = Object.values(count);

    new Chart(document.getElementById("sessionChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Total Attendance By Session Type",
                data,
                backgroundColor: "rgba(241, 3, 47, 0.7)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" }, beginAtZero: true }
            },
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            }
        }
    });
};










