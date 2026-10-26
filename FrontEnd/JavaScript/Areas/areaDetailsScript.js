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
    
    const sql = `SELECT * FROM tblArea WHERE postCode = '${id}'`;
    const result = await runQuery(sql);
    const area = result.data[0];

    if (!area) {
        console.error("No area data found");
        return;
    }

    // populate fields
    document.getElementById("areaDetailsValue").textContent =  area.postCode;
    document.getElementById("areaDetailsName").textContent = "Area Name: " + area.areaName;
    document.getElementById("areaDetailsBusinesses").textContent =  "Number of Businesses: "  + area.noOfBusinesses;
   

});








