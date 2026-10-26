
function validateResearcher(researcher) {
    if (researcher.researcherForename.length > 50 || researcher.researcherForename.trim() === "") {
        alert("Forename must be less than 50 characters and not null");
        return false;
    }

    if (researcher.researcherSurname.length > 50 || researcher.researcherSurname.trim() === "") {
        alert("Surname must be less than 50 characters and not null.");
        return false;
    }

    if (researcher.researcherAreaOfExpertise.length > 300 || researcher.researcherAreaOfExpertise.trim() === "") {
        alert("Area of Expertise must be less than 300 characters and not null.");
        return false;
    }

    if (researcher.researcherEmail.length > 50 || !researcher.researcherEmail.includes("@")) {
        alert("Email not valid, please ensure it is less than 50 characters and is in valid format.")
        return false;
    }

    if (!(researcher.researcherTelephone.trim().startsWith("+44") || researcher.researcherTelephone.trim().startsWith("0"))) {
        alert("Telephone number must start with +44 or 0")
        return false;
    }

    let digits = researcher.researcherTelephone.trim().startsWith("+44") ? researcher.researcherTelephone.trim().slice(3) 
    : researcher.researcherTelephone.trim().slice(1);

    if (digits.length < 9 || digits.length > 10) {
        alert("Telephone number must have 9 or 10 digits after the prefix (+44 or 0).")
        return false;
    }

    for (let ch of digits) {
        if (ch < "0" || ch > "9") {
            alert("Telephone numbers must be all digits");
            return false;
        }
    }

    return true;
}

const addResearcherToDB = async () => {
    event.preventDefault();
    let addResearcher = {
        researcherForename: document.getElementById("addResearcherForename").value.trim(),
        researcherSurname: document.getElementById("addResearcherSurname").value.trim(),
        researcherRole: document.getElementById("addResearcherRole").value.trim(),
        researcherAreaOfExpertise: document.getElementById("addResearcherAreaOfExpertise").value.trim(),
        researcherEmail: document.getElementById("addResearcherEmail").value.trim(),
        researcherTelephone: document.getElementById("addResearcherTelephone").value.trim()
    }

    if (validateResearcher(addResearcher) === false) {
        return;
    }

    const sqlAdd = `INSERT INTO tblResearcher 
                        (researcherForename, researcherSurname, researcherRole, areaOfExpertise, researcherEmail, researcherTelephone) 
                    VALUES 
                        ('${addResearcher.researcherForename}', 
                        '${addResearcher.researcherSurname}', 
                        '${addResearcher.researcherRole}',
                        '${addResearcher.researcherAreaOfExpertise}', 
                        '${addResearcher.researcherEmail}', 
                        '${addResearcher.researcherTelephone}');`;

    try {
        const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
            method: "POST",
            body: new URLSearchParams({ query: sqlAdd })
        });

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        console.log("DB Response: " + result);
        console.log("Full JSON:", JSON.stringify(result, null, 2));
        alert("Researcher Added.")
        document.getElementById("addResearcherForm").reset();
        return result;
    } catch (error) {
        console.log("There has been an error: " + error);
        return;
    }
}


const editResearcherInDB = async () => {
    event.preventDefault();
    let editResearcher = {
        researcherId: document.getElementById("editResearcherId").value.trim(),
        researcherForename: document.getElementById("editResearcherForename").value.trim(),
        researcherSurname: document.getElementById("editResearcherSurname").value.trim(),
        researcherRole: document.getElementById("editResearcherRole").value.trim(),
        researcherAreaOfExpertise: document.getElementById("editResearcherAreaOfExpertise").value.trim(),
        researcherEmail: document.getElementById("editResearcherEmail").value.trim(),
        researcherTelephone: document.getElementById("editResearcherTelephone").value.trim()
    }

    if (validateResearcher(editResearcher) === false) {
        return;
    }

    const sqlEdit = `UPDATE tblResearcher SET 
                        researcherForename = '${editResearcher.researcherForename}', 
                        researcherSurname = '${editResearcher.researcherSurname}', 
                        researcherRole = '${editResearcher.researcherRole}', 
                        areaOfExpertise = '${editResearcher.researcherAreaOfExpertise}', 
                        researcherEmail = '${editResearcher.researcherEmail}', 
                        researcherTelephone = '${editResearcher.researcherTelephone}' 
                    WHERE researcherId = '${editResearcher.researcherId}';`;

    try {
        const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
            method: "POST",
            body: new URLSearchParams({ query: sqlEdit })
        });

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        console.log("DB Response: " + result);
        console.log("Full JSON:", JSON.stringify(result, null, 2));
        alert("Researcher Edited.");
        document.getElementById("editResearcherForm").reset();
        return result;
    } catch (error) {
        console.log("There has been an error: " + error);
        return;
    }
}

const deleteResearcherFromDB = async () => {
    event.preventDefault();
    let deleteResearcher = {
        researcherId: document.getElementById("deleteResearcherId").value
    }

    const sqlDelete = `DELETE FROM tblResearcher WHERE researcherId = '${deleteResearcher.researcherId}';`;

    try {
        const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
            method: "POST",
            body: new URLSearchParams({ query: sqlDelete })
        });

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Success!")
        alert("Researcher Deleted.");
        document.getElementById("deleteResearcherForm").reset();
        return result;
    } catch (error) {
        console.log("There has been an error: " + error);
        return;
    }
}

document.getElementById("addResearcherButton").addEventListener("click", addResearcherToDB);

document.getElementById("editResearcherButton").addEventListener("click", editResearcherInDB);

document.getElementById("deleteResearcherButton").addEventListener("click", deleteResearcherFromDB);

const getResearchersFromDB = async () => {
    try {
        const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
            method: "POST",
            body: new URLSearchParams({ query: `SELECT researcherId, researcherForename, researcherSurname FROM tblResearcher` })
        });

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.log("There has been an error: " + error);
        return [];
    }
}

const researcherSelect = async () => {
    const editSelect = document.getElementById("editResearcherId");
    const deleteSelect = document.getElementById("deleteResearcherId");
    editSelect.innerHTML = "";
    deleteSelect.innerHTML = "";

    const researchers = await getResearchersFromDB();

    researchers.forEach(r => {
        const option1 = document.createElement("option");
        option1.value = r.researcherId;
        option1.textContent = `ID: ${r.researcherId}, ${r.researcherForename} ${r.researcherSurname}`;
        editSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = r.researcherId;
        option2.textContent = `ID: ${r.researcherId}, ${r.researcherForename} ${r.researcherSurname}`;
        deleteSelect.appendChild(option2);
    });
}

const getAllResearchers = async () => {
    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: `SELECT * FROM tblResearcher` })
    });

    const result = await response.json();
    console.log(result);
    return result.data;
}

const filterResearchers = async () => {
    let filterResearcher = {
        researcherForename: document.getElementById("filterForename")?.value.trim() || "",
        researcherSurname: document.getElementById("filterSurname")?.value.trim() || "",
        researcherRole: document.getElementById("filterRole")?.value.trim() || "",
        researcherAreaOfExpertise: document.getElementById("filterAreaOfExpertise")?.value.trim() || ""
    }

    let sql = `SELECT * FROM tblResearcher`
    let filters = [];

    if (filterResearcher.researcherForename.trim() !== "") {
        filters.push(`researcherForename LIKE '%${filterResearcher.researcherForename}%'`)
    }
    if (filterResearcher.researcherSurname.trim() !== "") {
        filters.push(`researcherSurname LIKE '%${filterResearcher.researcherSurname}%'`)
    }
    if (filterResearcher.researcherRole.trim() !== "") {
        filters.push(`researcherRole LIKE '%${filterResearcher.researcherRole}%'`)
    }
    if (filterResearcher.researcherAreaOfExpertise.trim() !== "") {
        filters.push(`areaOfExpertise LIKE '%${filterResearcher.researcherAreaOfExpertise}%'`)
    }

    if (filters.length > 0) {
        sql += ` WHERE ` + filters.join(` AND `)
    }

    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    return result.data;
}

const displayResearchers = async (input) => {
    try {
        const result = await input();
        const container = document.getElementById("researchers-table");

        let html = "<table border = 1><tr>";

        const columns = Object.keys(result[0]);

        html += `<tr><th>Researcher ID</th>`
        html += `<th>Researcher Forename</th>`
        html += `<th>Researcher Surname</th>`
        html += `<th>Researcher Role</th>`
        html += `<th>Researcher Area Of Expertise</th>`
        html += `<th>Researcher Email</th>`
        html += `<th>Researcher Telephone</th>`
        html += `<th>Action</th></tr>`

        result.forEach(row => {
            html += "<tr>";
            columns.forEach(col => {
                html += `<td>${row[col]}</td>`;
            })
            html += `<td><button onclick="researcherDetailsPage(${row.researcherId})">Details</button></td>`
            html += "</tr>";
        });

        html += "</table>";
        container.innerHTML = html;
    } catch (error) {
        console.log("There has been an error: " + error);
        return [];
    }
}

const researcherDetailsPage = (researcherId) => {
    localStorage.setItem("selectedResearcherId", researcherId);
    window.location.href = "../researchers/researcherDetails.html";
};


document.addEventListener("DOMContentLoaded", researcherSelect);
document.addEventListener("DOMContentLoaded", displayResearchers(getAllResearchers));

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("filterForename").addEventListener("input", () => {
        displayResearchers(filterResearchers);
    });
    document.getElementById("filterSurname").addEventListener("input", () => {
        displayResearchers(filterResearchers);
    });
    document.getElementById("filterRole").addEventListener("input", () => {
        displayResearchers(filterResearchers);
    });
    document.getElementById("filterAreaOfExpertise").addEventListener("input", () => {
        displayResearchers(filterResearchers);
    });
});


const tableToggle = document.querySelector("#table-toggle");
const tableContent = document.querySelector("#researchers-table");

tableToggle.addEventListener("click", () => {
    const visibility = tableContent.style.display === "block";
    tableContent.style.display = visibility ? "none" : "block";
    tableToggle.textContent = visibility ? "Show Table ▼" : "Hide Table ▲"
});

const fetchTablesData = async () => {
    const sql = `SELECT tblResearcher.researcherRole, COUNT(tblResearcher.researcherId) AS researcherCount FROM tblResearcher 
    GROUP BY tblResearcher.researcherRole ORDER BY researcherCount DESC;`;

    try {
        const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
            method: "POST",
            body: new URLSearchParams({ query: sql })
        });

        const result = await response.json();
        console.log(result)
        return result.data;
    }
    catch (error) {
        console.error("An error has occurred", err);
        return null;
    }
}

const drawChart = async () => {
    const ctx = document.getElementById("myChart");
    const chartData = await fetchTablesData();

    const roleLabels = chartData.map(row => row.researcherRole);
    const roleNumbers = chartData.map(row => Number(row.researcherCount));

    const data = {
        labels: roleLabels,
        datasets: [{
            label: 'Researcher Roles',
            data: roleNumbers,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)'
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    };

    new Chart(ctx, config);
}

document.addEventListener("DOMContentLoaded", drawChart);


