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
        output.textContent = error.message;
    }
};

/* Retrieve data for comboboxes */


const returnAreaPostcodes = async () => {

    const sql = "SELECT postCode FROM tblArea ORDER BY postCode ASC";

    try{

        const result = await runQuery(sql);

        return result;
    }
    catch{

        console.error("Failed to retrieve Area Postcodes.");
        return null;
    }
}



const returnSelectedArea = async (value) => {

    console.log("Successfully retrieved selected area data.");
    const sql = `SELECT * FROM tblArea WHERE postCode = '${value}'`;

     try{

        const result = await runQuery(sql);

        console.log(result);
        return result.data[0];
        
    }
    catch{

        console.error("Failed to retrieve selected area data.");
        return null;
    }
}



/*populate comboboxes upon tab change*/

const loadEditAreaData = async () => {

    console.log("Populated Edit Area Comboboxes");

    const postCodes = (await returnAreaPostcodes()).data;
    

    const areaCbx = document.getElementById("editAreaPostcode");
    

    areaCbx.select = "";

    

     for (let i = 0; i < postCodes.length; i++) {

        const areaPostcodeOption = document.createElement("option");
        areaPostcodeOption.value = postCodes[i].postCode;
        areaPostcodeOption.textContent = postCodes[i].postCode;

        areaCbx.add(areaPostcodeOption);
        

    }

    
}

const loadDeleteAreaData = async () => {

    console.log("Populated Delete Area Comboboxes");

    const postCodes = (await returnAreaPostcodes()).data;
    

    const areaCbx = document.getElementById("deleteAreaPostcode");
    

    areaCbx.select = "";

    

     for (let i = 0; i < postCodes.length; i++) {

        const areaPostcodeOption = document.createElement("option");
        areaPostcodeOption.value = postCodes[i].postCode;
        areaPostcodeOption.textContent = postCodes[i].postCode;

        areaCbx.add(areaPostcodeOption);
        

    }

    
}




/*Return data of selected Area */
const getSelectedAreaEDIT = async () => {

   
    const id = document.getElementById("editAreaPostcode").value;

    if(!id) 
        return;

    const area = await returnSelectedArea(id);

    if (!area)
        return;

    document.getElementById("editAreaPostcode").value = area.postCode;
    document.getElementById("editAreaName").value = area.areaName;
    document.getElementById("editNoOfBusinesses").value = area.noOfBusinesses;
    


 console.log("Retrieved selected area data");    


}

const getSelectedAreaDELETE= async () => {

   
    const id = document.getElementById("deleteAreaPostcode").value;

    if(!id) 
        return;

    const area = await returnSelectedArea(id);

    if (!area)
        return;

    document.getElementById("deleteAreaPostcode").value = area.postCode;
    document.getElementById("deleteAreaName").value = area.areaName;
    document.getElementById("deleteNoOfBusinesses").value = area.noOfBusinesses;
    


 console.log("Retrieved selected area data");    
}



/*AREA AED*/

//ADD AREA
const addArea = async () => {

    const postCode = document.getElementById("addAreaPostcode").value;
    const name = document.getElementById("addAreaName").value;
    const businessCount = document.getElementById("addNoOfBusinesses").value;


    if (!validatePostcode(postCode)){
        alert("Invalid Postcode. Field must not be empty & max length is 4 characters.");
        return;
    }


    if (!validateAreaName(name)){
        alert("Invalid area name. Field must not be empty & max length is 120 characters.");
        return;
    }

    if (!validateBusinessNumber(businessCount)){
        alert("Invalid business count. Must be a positive integer.");
        return;
    }

    

    const sql = `
        INSERT INTO tblArea 
        (postCode, areaName, noOfBusinesses)
        VALUES ('${postCode}', '${name}', ${businessCount})
    `;

    const result = await runQuery(sql);

    if (!result.success || result.affected_rows === 0) {
        alert("Postcode already exists.");
        return;
    }

    alert("Area has been added.");

    //refresh table
   await printTable();
    location.reload();
}

//EDIT AREA
const editArea = async () => {

    const postCode = document.getElementById("editAreaPostcode").value;
    const name = document.getElementById("editAreaName").value;
    const businessCount = document.getElementById("editNoOfBusinesses").value;


    if (!validateAreaName(name)){
        alert("Invalid area name. Field must not be empty & max length is 120 characters.");
        return;
    }

    if (!validatePostcode(postCode)){
        alert("Invalid Postcode. Field must not be empty & max length is 4 characters.");
        return;
    }

    if (!validateBusinessNumber(businessCount)){
        alert("Invalid business count. Must be a positive integer.");
        return;
    }

    

    const sql = `
        UPDATE tblArea
        SET areaName = '${name}',
            noOfBusinesses = '${businessCount}'
        WHERE postCode = '${postCode}'
    `;

    await runQuery(sql);
    alert("Area has been updated.");

    //refresh table
   await printTable();
   location.reload();
    
}

//DELETE AREA
const deleteArea = async () => {

    const postCode = document.getElementById("deleteAreaPostcode").value;
    const name = document.getElementById("deleteAreaName").value;
    const businessCount = document.getElementById("deleteNoOfBusinesses").value;


    if (!validateAreaName(name)){
        alert("Invalid area name. Field must not be empty & max length is 120 characters.");
        return;
    }

    if (!validatePostcode(postCode)){
        alert("Invalid Postcode. Field must not be empty & max length is 4 characters.");
        return;
    }

    if (!validateBusinessNumber(businessCount)){
        alert("Invalid business count. Must be a positive integer.");
        return;
    }


     const confirmDelete = confirm("Are you sure you want to delete this Area?");

    if (!confirmDelete) {
        return; 
    }
    

   const sql = `DELETE FROM tblArea WHERE postCode = '${postCode}'`;

    await runQuery(sql);
    alert("Area has been deleted.");

    //refresh table
    await printTable();
    location.reload();
    
}




let renderId = 0;

/*area Table*/
const printTable = async () => {

     const currentRender = ++renderId;


    //referenced as areaTable in css
    const output = document.querySelector("#areaTable");
    console.log("areaTable element:", output);
    output.innerHTML = "";

     if (!output) {
    console.error("areaTable not found");
    return;
     }

    //sql used
    const sql = "SELECT * FROM tblArea;";
    //call the runQuery function to initiate connection with the given sql
    const result = await runQuery(sql);

    //prevents glitch of duplicate rows from appearing
    if (currentRender !== renderId) return;

    //create the rows based on the data retrieved
    const rows = result.data;

    //filter function
    const selectedPostcode = document.getElementById("areaPostcode").value;
    const selectedAreaName = document.getElementById("areaName").value;
    const selectedNumberOfBusinesses = document.getElementById("areaNumberOfBusinesses").value;
  

    let filteredRows = rows;

    if (selectedPostcode !== "") {
        filteredRows = filteredRows.filter(row =>
            row.postCode &&
            row.postCode.toLowerCase().includes(selectedPostcode.toLowerCase())
        );
    }

     if (selectedAreaName !== "") {
        filteredRows = filteredRows.filter(row =>
            row.areaName &&
            row.areaName.toLowerCase().includes(selectedAreaName.toLowerCase())
        );
    }

    if (selectedNumberOfBusinesses !== "") {
        filteredRows = filteredRows.filter(row =>
            row.noOfBusinesses &&
            row.noOfBusinesses === selectedNumberOfBusinesses
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
       "PostCode",
       "Area Name",
       "Number Of Businesses"
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

        //event listener for row click and saving area details
        tr.addEventListener("click", () => {
            console.log("CLICKED ROW:", row);

            localStorage.setItem("selectedArea", JSON.stringify(row));

            console.log("STORED:", localStorage.getItem("selectedArea"));

            window.location.href = `areaDetails.html?id=${row.postCode}`;
        });
        
        tr.innerHTML = `
            <td>${row.postCode}</td>
            <td>${row.areaName}</td>
            <td>${row.noOfBusinesses}</td>
           
        `;
        

        table.appendChild(tr);
    });



    output.appendChild(table);

    console.log(rows[0]);
    
};

/* Event listeners */

//create table when web page is opened.
document.addEventListener("DOMContentLoaded", () => {
    printTable();

    document.getElementById("areaName")
        .addEventListener("input", printTable);
    document.getElementById("areaPostcode")
        .addEventListener("input", printTable);
    document.getElementById("areaNumberOfBusinesses")
        .addEventListener("input", printTable);

    //reset form inputs when refreshing page
    document.getElementById("areaForm").reset();
    document.getElementById("areaTabForms").reset();
    resetAreaForm();

    //aed buttons
    document.getElementById("addAreaButton").addEventListener("click", addArea);
    document.getElementById("editAreaButton").addEventListener("click", editArea);
    document.getElementById("deleteAreaButton").addEventListener("click", deleteArea);


    document.getElementById("editAreaPostcode").addEventListener("change", getSelectedAreaEDIT);
    document.getElementById("deleteAreaPostcode").addEventListener("change", getSelectedAreaDELETE);


     const toggleBtn = document.getElementById("showAreaTableButton");

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

//validate Postcode - not empty and max length of 4 characters
const validatePostcode = postcode => {
    return isNotEmpty(postcode) && maxLength(postcode, 4);
};

//validate area name - not empty and max length of 120 characters
const validateAreaName = name => {
    return isNotEmpty(name) && maxLength(name, 120);
};

//validate number of businesses - not 0 or less than 0,  and is a number
const validateBusinessNumber = count => {
    return isNotEmpty(count) && isNumber(count) && isPositive(count);
}




//RESET AED INPUTS MANUALLY
const resetAreaForm = () => {
    document.getElementById("addAreaPostcode").value = "";
    document.getElementById("addAreaName").value = "";
    document.getElementById("addNoOfBusinesses").value = "";


    document.getElementById("editAreaPostcode").value = "";
    document.getElementById("editAreaName").value = "";
    document.getElementById("editNoOfBusinesses").value = "";

    document.getElementById("deleteAreaPostcode").value = "";
    document.getElementById("deleteAreaName").value = "";
    document.getElementById("deleteNoOfBusinesses").value = "";
};





