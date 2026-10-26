//------------------------------------------------------------Event Listeners-----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");
    initializeTable();
    loadPublicationChart();
    initializePublicationComboBox();
    initializeResearcherComboBox();

    const fields = ["Title", "Date", "Details", "Summary"];

    fields.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("input", async () => {
            const filtered = await returnFilteredPublications();
            if (filtered) {
                clearTable();
                populateTable(filtered.data);
            }
        });
    });

    document.getElementById("addButton").addEventListener("click", async () => {
        const validation = await fieldValidation(document.getElementById("addTitle").value, document.getElementById("addSummary").value, document.getElementById("addDetails").value, document.getElementById("addDate").value, "add");
        if(validation){
            await addPublication(); 
            const updated = await returnAllPublications();
            populateTable(updated.data);
            initializePublicationComboBox();
            document.getElementById("addTitle").value = "";
            document.getElementById("addSummary").value = "";
            document.getElementById("addDetails").value = "";
            document.getElementById("addDate").value = "";
            alert("Publication Added");
        }
    });

    document.getElementById("editButton").addEventListener("click", async () => {
        if(document.getElementById("editPublicationID").value != ""){
            const validation = await fieldValidation(document.getElementById("editTitle").value, document.getElementById("editSummary").value, document.getElementById("editDetails").value, document.getElementById("editDate").value, "edit");
            console.log(validation);
            if(validation)
            {
                await editPublication();
                const updated = await returnAllPublications();
                populateTable(updated.data);
                initializePublicationComboBox();
                document.getElementById("editTitle").value = "";
                document.getElementById("editSummary").value = "";
                document.getElementById("editDetails").value = "";
                document.getElementById("editDate").value = "";
                alert("Publication Edited");
            }
        }
        else{
            alert("Please select a publication");
        }
    });

    document.getElementById("deleteButton").addEventListener("click", async () => {
        if(window.confirm("This will delete this Publication, are you sure you want to continue?")){
            if(document.getElementById("deletePublicationID").value != ""){
                await deletePublication();
            
                const updated = await returnAllPublications();
                populateTable(updated.data);

                initializePublicationComboBox();
                document.getElementById("deleteTitle").value = "";
                document.getElementById("deleteSummary").value = "";
                document.getElementById("deleteDetails").value = "";
                document.getElementById("deleteDate").value = "";
            }
            else{
                alert("Please select a publication");
            }
        }
    });

    document.getElementById("assignButton").addEventListener("click", async () => {
    const isValid = await assignValidation(
        document.getElementById("assignResearcher").value,
        document.getElementById("assignPublication").value
    );

    if (isValid) {
        await assignResearcher();

        const updated = await returnAllPublications();
        populateTable(updated.data);

        initializePublicationComboBox();
        document.getElementById("assignPublication").value = "";
        document.getElementById("assignResearcher").value = "";
    }
});

    document.getElementById("unassignButton").addEventListener("click", async () => {
        if(document.getElementById("unassignPublication").value != ""){
            await unAssignResearcher();
            
            const updated = await returnAllPublications();
            populateTable(updated.data);

            initializePublicationComboBox();
            document.getElementById("unassignResearcher").value = "";
            document.getElementById("unassignPublication").value = "";
        }
        else{
            alert("Please select a publication");
        }
    });

    document.getElementById("editPublicationID").addEventListener("change", async () => {
        await initializeEditData();  
    });

    document.getElementById("deletePublicationID").addEventListener("change", async () => {
        await initializeDeleteData();  
    });

    document.getElementById("unassignPublication").addEventListener("change", async () =>{
        initializeUnassignData();
    });
});

//-----------------------------------------------------------Functions------------------------------------------------------------

//----------------------------------------------------------Validation---------------------------------------------------------

const fieldValidation = async(title, summary, details, date, type)  =>{ 
    if(title.trim() != "" && summary.trim() != "" && details.trim() != "" && date.trim() != ""){ 
        if(title.trim().length <= 50){
            if(summary.trim().length <= 500){
                const allPublications = (await returnAllPublications()).data;
                const titleExists = allPublications.some(p => p.publicationTitle == title);
                if(!titleExists){
                    return true;
                }
                else{
                    if(type == "edit"){ //Ensures the other changes can go through if the title remains the same in an edit
                        const originalPublication = await returnSpecificPublication(document.getElementById("editPublicationID")?.value);
                        if(originalPublication.data[0].publicationTitle == title){
                            return true
                        }
                    }
                    alert("A publication with this title already exists, please pick another")
                    return false;
                }
            }
            else{
                alert("Summary must be 500 or less characters");
                return false;
            }
        }
        else{
            alert("Title must be 50 or less characters");
            return false;
        }
    }
    else{
        alert("Leave no boxes blank");
        return false;
    }
}

const assignValidation = async (researcherId, publicationId) => {

    if (researcherId === "" || publicationId === "") {
        alert("Leave no boxes blank");
        return false;
    }

    const result = await returnPublicationResearchers(publicationId);
    const assignedResearchers = result.data;

    const isAssigned = assignedResearchers.some(r => r.researcherId == researcherId);

    if (isAssigned) {
        alert("This researcher is already assigned to this publication");
        return false;
    }

    return true;
};





//--------------------------------------------Initilizers/Re-Initilizers for HTML elements-------------------------------------

const loadPublicationChart = async () => {
    const publications = await returnPublicationYearCounts();

    const rows = publications.data || [];

    const labels = rows.map(row => row.publicationYear);
    const data = rows.map(row => row.yearCount);

    new Chart(document.getElementById("yearChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Number of publications per year",
                data,
                backgroundColor: "rgba(12, 33, 225, 0.7)"
            }]
        }
    });
};

async function initializeTable() {
    const allPublications = (await returnAllPublications()).data;
    populateTable(allPublications);
}

async function initializePublicationComboBox(){  
    const editPublicationId = document.getElementById("editPublicationID");
    const deletePublicationId = document.getElementById("deletePublicationID");
    const assignPublicationId = document.getElementById("assignPublication")
    const unassignPublicationId = document.getElementById("unassignPublication")

    editPublicationId.innerHTML = ""; //Clears boxes
    deletePublicationId.innerHTML = "";
    assignPublicationId.innerHTML = "";
    unassignPublicationId.innerHTML = "";


    const blank1 = document.createElement("option");
    blank1.value = "";
    blank1.textContent = "";
    editPublicationId.appendChild(blank1);

    const blank2 = document.createElement("option");
    blank2.value = "";
    blank2.textContent = "";
    deletePublicationId.appendChild(blank2);

    const blank3 = document.createElement("option");
    blank3.value = "";
    blank3.textContent = "";
    assignPublicationId.appendChild(blank3);

    const blank4 = document.createElement("option");
    blank4.value = "";
    blank4.textContent = "";
    unassignPublicationId.appendChild(blank4);

    const publicationData = await returnAllPublications();
    const allPublications = publicationData.data;

    allPublications.forEach(p => {
        const opt1 = document.createElement("option");
        opt1.value = p.publicationId;
        opt1.textContent = `${p.publicationId} - ${p.publicationTitle} ${p.publicationDate}`;
        editPublicationId.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = p.publicationId;
        opt2.textContent = `${p.publicationId} - ${p.publicationTitle} ${p.publicationDate}`;
        deletePublicationId.appendChild(opt2);

        const opt3 = document.createElement("option");
        opt3.value = p.publicationId;
        opt3.textContent = `${p.publicationId} - ${p.publicationTitle} ${p.publicationDate}`;
        assignPublicationId.appendChild(opt3);

        const opt4 = document.createElement("option");
        opt4.value = p.publicationId;
        opt4.textContent = `${p.publicationId} - ${p.publicationTitle} ${p.publicationDate}`;
        unassignPublicationId.appendChild(opt4);
    });
}


async function initializeResearcherComboBox() { 
    const addSelect = document.getElementById("assignResearcher");

    addSelect.innerHTML = "";

    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "";
    addSelect.appendChild(blank);

    const researcherData = await returnAllResearchers();
    const allResearchers = researcherData.data;

    allResearchers.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.researcherId;
        opt.textContent = `${r.researcherId} - ${r.researcherForename} ${r.researcherSurname}`;
        addSelect.appendChild(opt);
    });
}

async function initializeEditData() {
    const id = document.getElementById("editPublicationID").value;

    const result = await returnSpecificPublication(id);

    if (!result || !result.data || result.data.length === 0) { //Handles blank option as well as accidental misfires of the event listener (Issue seems gone however??)
        console.warn("No data, blank option selected or potential misfire");
        document.getElementById("editTitle").value = "";
        document.getElementById("editSummary").value = "";
        document.getElementById("editDetails").value = "";
        document.getElementById("editDate").value = "";
        return;
    }

    const publication = result.data[0];

    document.getElementById("editTitle").value = publication.publicationTitle;
    document.getElementById("editSummary").value = publication.publicationSummary;
    document.getElementById("editDetails").value = publication.publicationDetails;
    document.getElementById("editDate").value = publication.publicationDate;
}

async function initializeDeleteData() {
    const id = document.getElementById("deletePublicationID").value;

    const result = await returnSpecificPublication(id);

    if (!result || !result.data || result.data.length === 0) { //Handles blank option as well as accidental misfires of the event listener bc I couldnt figure out how to stop them
        console.error("No data, potential misfire or blank option selected");
        return;
    }

    const publication = result.data[0];

    document.getElementById("deleteTitle").value = publication.publicationTitle;
    document.getElementById("deleteSummary").value = publication.publicationSummary;
    document.getElementById("deleteDetails").value = publication.publicationDetails;
    document.getElementById("deleteDate").value = publication.publicationDate;
}

async function initializeUnassignData() {
    const id = document.getElementById("unassignPublication").value;

    const result = await returnPublicationResearchers(id);

    if (!result || !result.data || result.data.length === 0) {
        console.error("No data, potential misfire or blank option selected");
        return;
    }

    const unassignSelect = document.getElementById("unassignResearcher");
    unassignSelect.innerHTML = "";

    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "";
    unassignSelect.appendChild(blank);

    const allResearchers = result.data;

    for (const r of allResearchers) {
        const response = await returnSpecificResearcher(r.researcherId);

        const researcher = response.data[0];

        const opt = document.createElement("option");
        opt.value = researcher.researcherId;
        opt.textContent = `${researcher.researcherId} - ${researcher.researcherForename} ${researcher.researcherSurname}`;
        unassignSelect.appendChild(opt);
    }
}

function clearTable() {
    const table = document.getElementById("publicationTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function populateTable(publications) {
    clearTable();
    const table = document.getElementById("publicationTable");

    publications.forEach(p => {
        const row = table.insertRow();

        row.insertCell().textContent = p.publicationId;
        row.insertCell().textContent = p.publicationTitle;
        row.insertCell().textContent = p.publicationDate;
        row.insertCell().textContent = p.publicationDetails;
        row.insertCell().textContent = p.publicationSummary;

        row.addEventListener("click", () => {
            window.location.href = `publicationDetails.html?publicationId=${p.publicationId}`;
        });
    });
}

//----------------------------------------------------------------SQL--------------------------------------------------------

const returnAllResearchers = async () => {
    const sql = "SELECT researcherId, researcherForename, researcherSurname FROM tblResearcher;";
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

const returnSpecificResearcher = async (id) => {
    const sql = `SELECT researcherId, researcherForename, researcherSurname FROM tblResearcher WHERE researcherId = '${id};'`;
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );

        if (!response.ok)throw new Error(`Server error: ${response.status}`);
        return await response.json();

    } catch (err) {
        console.error("Error while fetching researcher:", err);
        return null;
    }
};

const returnAllPublications = async () => {
    const sql = "SELECT * FROM tblPublication;";
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();

    } catch (err) {
        console.error("Error while fetching publications:", err);
        return null;
    }
};

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
        console.error("Error while fetching publications:", err);
        return null;
    }
};



const returnFilteredPublications = async () => {
    const title = document.getElementById("Title")?.value.trim();
    const date = document.getElementById("Date")?.value.trim();
    const details = document.getElementById("Details")?.value.trim();
    const summary = document.getElementById("Summary")?.value.trim();

    let sql = "SELECT * FROM tblPublication";
    let conditions = [];

    if (title) conditions.push(`publicationTitle LIKE '%${title}%'`);
    if (date) conditions.push(`publicationDate = '${date}'`);
    if (details) conditions.push(`publicationDetails LIKE '%${details}%'`);
    if (summary) conditions.push(`publicationSummary LIKE '%${summary}%'`);

    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");

    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
    } catch (err) {
        console.error("Error while fetching publications:", err);
        return null;
    }
};



const addPublication = async () => {
    const title = document.getElementById("addTitle")?.value.trim();
    const date = document.getElementById("addDate")?.value.trim();
    const details = document.getElementById("addDetails")?.value.trim();
    const summary = document.getElementById("addSummary")?.value.trim();
    
    const addPublication = `INSERT INTO tblPublication (publicationTitle, publicationDetails, publicationDate, publicationSummary) VALUES ('${title}', '${details}', '${date}', '${summary}');`;

    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: addPublication }) }
        );

        console.log(addPublication);

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while adding publication:", err);
        return null;
    }
};  


const editPublication = async () => {
    const id = document.getElementById("editPublicationID")?.value;
    const title = document.getElementById("editTitle")?.value.trim();
    const date = document.getElementById("editDate")?.value.trim();
    const details = document.getElementById("editDetails")?.value.trim();
    const summary = document.getElementById("editSummary")?.value.trim();

    const editPublication = `UPDATE tblPublication SET publicationTitle = '${title}', publicationDetails = '${details}', publicationDate = '${date}', publicationSummary = '${summary}' WHERE publicationId = '${id}';`;

    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: editPublication }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while editing publication:", err);
        return null;
    }
};

const deletePublication = async () => {
    const id = document.getElementById("deletePublicationID")?.value;
    const deletePublication = `DELETE FROM tblPublication WHERE publicationId = '${id}';`;

    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: deletePublication }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while deleting publication:", err);
        return null;
    }
};

const assignResearcher = async () => {
    const researcherId = document.getElementById("assignResearcher")?.value;
    const publicationId = document.getElementById("assignPublication")?.value;
    const assignResearcherPublication = `INSERT INTO tblResearcherPublication(researcherId, publicationId) VALUES ('${researcherId}', '${publicationId}');`;
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: assignResearcherPublication }) }
        );
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while assigning Researcher:", err);
        return null;
    }
};

const unAssignResearcher = async () => {
    const researcherId = document.getElementById("unassignResearcher")?.value;
    const publicationId = document.getElementById("unassignPublication")?.value;
    const unAssignResearcherPublication = `DELETE FROM tblResearcherPublication WHERE publicationId = ${publicationId} AND researcherId = ${researcherId};`;
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: unAssignResearcherPublication }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while un-assigning Researcher:", err);
        return null;
    }
};

const returnPublicationResearchers = async (id)=>{
    const publicationResearchers = `SELECT researcherId from tblResearcherPublication WHERE publicationId = ${id};`;
    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: publicationResearchers }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();
        
    } catch (err) {
        console.error("Error while getting Researchers:", err);
        return null;
    }
}

const returnPublicationYearCounts = async () => {
    const sql = "SELECT YEAR(publicationDate) AS publicationYear,"
    +" COUNT(*) AS yearCount"
    +" FROM tblPublication"
    +" GROUP BY YEAR(publicationDate)"
    +" ORDER BY publicationYear;";

    try {
        const response = await fetch(
            "https://tbarnes03.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
            { method: "POST", body: new URLSearchParams({ query: sql }) }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        return await response.json();

    } catch (err) {
        console.error("Error while fetching publication years:", err);
        return null;
    }
};

