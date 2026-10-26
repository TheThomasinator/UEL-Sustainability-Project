console.log("JS file loaded");

/*Event Listeners */
document.addEventListener("DOMContentLoaded", event => 
    {console.log("DOM content loaded");
        createListeners();//creates AED listeners
        initializeTable();//initializes filter table 
        initializeComboboxIDs();//initializes comboboxes containing partner IDs
        initializeComboboxPostcode();//initializes comboboxes containing postcodes
        initializeFilterListeners();//initializes filter option listsners
        initializeCbxChangeListener();//initializes the ability to automatically enter data based on ID
        drawChart();//initializes the chart in the read page
    });

let allPartners = [];

function createListeners()
{
    document.getElementById("AP").addEventListener("submit", handleAdd); /*event listener for add page */

    document.getElementById("EP").addEventListener("submit", handleEdit); /*event listener for edit page */

    document.getElementById("DP").addEventListener("submit", handleDelete); /*event listener for delete page */

}

async function initializeTable()
{
    let partners = (await returnAllPartners()).data;
    console.log(partners);
    allPartners = partners;
    updateTable(partners);
}

async function initializeComboboxIDs()
{
    console.log("method called");
    const allIds = (await returnPartnerIds()).data;
    const allNames = (await returnPartnerNames()).data;

    console.log(allIds);
    
    const cbx1 = document.getElementById("editPartnerId");
    const cbx2 = document.getElementById("deletePartnerId");

    for(let i=0; i<allIds.length;i++)
    {
        const IdOption1 = document.createElement("option");
        IdOption1.value = allIds[i].partnerId;
        IdOption1.textContent = allIds[i].partnerId+ " "+ allNames[i].partnerName;

        const IdOption2 = document.createElement("option");
        IdOption2.value = allIds[i].partnerId;
        IdOption2.textContent = allIds[i].partnerId + " "+ allNames[i].partnerName;

        cbx1.add(IdOption1);
        cbx2.add(IdOption2);
    }
}

async function initializeComboboxPostcode()
{
    const allCodes = (await returnPostcodes()).data;

    const cbxPostcodeRead = document.getElementById("postcodeBoxRead");
    const cbxPostcodeAdd = document.getElementById("postcodeBoxAdd");
    const cbxPostcodeEdit = document.getElementById("postcodeBoxEdit");
    const cbxPostcodeDelete = document.getElementById("postcodeBoxDelete");

    for(let i=0;i<allCodes.length;i++)
    {
        const IdOption1 = document.createElement("option");
        IdOption1.value = allCodes[i].postcode;
        IdOption1.textContent = allCodes[i].postcode;

        const IdOption2 = document.createElement("option");
        IdOption2.value = allCodes[i].postcode;
        IdOption2.textContent = allCodes[i].postcode;

        const IdOption3 = document.createElement("option");
        IdOption3.value = allCodes[i].postcode;
        IdOption3.textContent = allCodes[i].postcode;

        const IdOption4 = document.createElement("option");
        IdOption4.value = allCodes[i].postcode;
        IdOption4.textContent = allCodes[i].postcode;

        cbxPostcodeRead.add(IdOption1);
        cbxPostcodeAdd.add(IdOption2);
        cbxPostcodeEdit.add(IdOption3);
        cbxPostcodeDelete.add(IdOption4);
    }
}

function initializeFilterListeners()
{
    document.getElementById("partnerNameInput").addEventListener("input", filterTable);
    document.getElementById("partnerAidDescInput").addEventListener("input", filterTable);
    document.getElementById("roleInput").addEventListener("input", filterTable);
    document.getElementById("postcodeBoxRead").addEventListener("input", filterTable);
}

function initializeCbxChangeListener()
{
    document.getElementById("editPartnerId").addEventListener("input", () => {displayEditData(document.getElementById("editPartnerId").value)});
    document.getElementById("deletePartnerId").addEventListener("input", () => {displayDeleteData(document.getElementById("deletePartnerId").value)});
}


async function displayEditData(partnerId)//displays data in edit partner form, relating to chosen partner ID
{
    const partner = (await returnPartnerById(partnerId)).data;
    console.log(partnerId);

    const nameBox = document.getElementById("editPartnerName");
    const aidDescBox = document.getElementById("editPartnerAidDesc");
    const sectorBox = document.getElementById("editSector");
    const postcodeBox = document.getElementById("postcodeBoxEdit");

    nameBox.textContent = partner[0].partnerName;
    nameBox.value = partner[0].partnerName;

    aidDescBox.textContent = partner[0].partnerAidDesc;
    aidDescBox.value = partner[0].partnerAidDesc;
    
    console.log(partner[0].sector.trim());
    sectorBox.value = partner[0].sector;

    postcodeBox.value = partner[0].postCode;
}

async function displayDeleteData(partnerId)//displays data in delete partner form, relating to chosen partner ID
{
    const partner = (await returnPartnerById(partnerId)).data;
    console.log(partnerId);

    const nameBox = document.getElementById("deletePartnerName");
    const aidDescBox = document.getElementById("deletePartnerAidDesc");
    const sectorBox = document.getElementById("deleteSector");
    const postcodeBox = document.getElementById("postcodeBoxDelete");

    nameBox.textContent = partner[0].partnerName;
    nameBox.value = partner[0].partnerName;

    aidDescBox.textContent = partner[0].partnerAidDesc;
    aidDescBox.value = partner[0].partnerAidDesc;
    
    console.log(partner[0].sector.trim());
    sectorBox.value = partner[0].sector;

    postcodeBox.value = partner[0].postCode;
}

function filterTable()//filters the table based on updated items in form
{
    const nameFilter = document.getElementById("partnerNameInput").value.toLowerCase();
	const aidFilter = document.getElementById("partnerAidDescInput").value.toLowerCase();
	const roleFilter = document.getElementById("roleInput").value.toLowerCase();
    const postcodeFilter = document.getElementById("postcodeBoxRead").value.toUpperCase();

    console.log(nameFilter +" "+aidFilter+ " "+ roleFilter+" "+ postcodeFilter);
    console.log(allPartners);
	
	const filteredRows = allPartners.filter(partner => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
		const matchesName = partner.partnerName.toLowerCase().includes(nameFilter);
		const matchesAid = partner.partnerAidDesc.toLowerCase().includes(aidFilter);
        const matchesRole = partner.sector.toLowerCase().includes(roleFilter);
	    const matchesPostcode = partner.postCode.toUpperCase().includes(postcodeFilter);
		return matchesName && matchesAid && matchesRole && matchesPostcode;
	});
	
	updateTable(filteredRows);
}

function updateTable(partners)//Generic method to update table contents, used in initialization and any time the table is filtered
{
    const table = document.getElementById("partnerTable");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for(let i=0;i<partners.length;i++)
    {
        let partner = {
        partnerId : partners[i].partnerId,
        partnerName : partners[i].partnerName,
        partnerAidDesc : partners[i].partnerAidDesc,
        sector : partners[i].sector,
        postCode: partners[i].postCode
        }

        const row = table.insertRow();

        row.insertCell().textContent = partner.partnerId;
        row.insertCell().textContent = partner.partnerName;
        row.insertCell().textContent = partner.partnerAidDesc;
        row.insertCell().textContent = partner.sector;
        row.insertCell().textContent = partner.postCode;

        row.addEventListener("click", () => {window.location.href = `partnerDetails.html?partnerId=${partner.partnerId}`;});
    }
}

/*Handle methods*/
async function handleAdd(event)
{
    event.preventDefault();
    console.log("Method called");
    let partner = {
    partnerName : document.getElementById("addPartnerName").value,
    partnerAidDesc : document.getElementById("addPartnerAidDesc").value,
    sector : document.getElementById("addSector").value,
    postcode: document.getElementById("postcodeBoxAdd").value
    }

    console.log("Fields: "+partner.partnerName+" "+partner.partnerAidDesc+" "+partner.sector+" "+partner.postcode);

    if(checkFieldsNotEmpty(partner))
    {
        if(await validatePartner(partner))
        {
            if(await uniqueNameAdd(partner.partnerName))
            {
                console.log("Method ready to call");
            
                addPartnerToDB(partner);

                console.log("partner added");
                alert("partner added");
                document.getElementById("AP").reset();
                return;
            }
            else
            {
               alert("Partner name must be unique");
               return;
            }
        }
        else
        {
        alert("Invalid Fields");
        return;
        }
    }
    else
    {
        alert("Empty fields");
        return;
    }
}

async function handleEdit(event)
{
    event.preventDefault();

    let partner = {
    partnerId : document.getElementById("editPartnerId").value,
    partnerName : document.getElementById("editPartnerName").value,
    partnerAidDesc : document.getElementById("editPartnerAidDesc").value,
    sector : document.getElementById("editSector").value,
    postcode: document.getElementById("postcodeBoxEdit").value
    }


    if(checkFieldsNotEmpty(partner))
    {
        if(await validatePartner(partner))
        {
            const isUnique = (await uniqueNameEdit(partner.partnerName));
            if(isUnique)
            {
                console.log("Method ready to call");
            
                await editPartnerInDB(partner);

                console.log("partner edited successfully");
                alert("partner edited");

                document.getElementById("EP").reset();
                return;
            }
            else
            {
               alert("Partner name must be unique");
               return;
            }
        }
        else
        {
            alert("Invalid fields");
            return;
        }
    }
    else
    {
        alert("Empty fields");
        return;
    }
}

async function handleDelete(event)
{
     event.preventDefault();
    let partner = {
    partnerId : document.getElementById("deletePartnerId").value,
    partnerName : document.getElementById("deletePartnerName").value,
    partnerAidDesc : document.getElementById("deletePartnerAidDesc").value,
    sector : document.getElementById("deleteSector").value,
    postcode: document.getElementById("postcodeBoxDelete").value
    }

    if(await IdExists(partner.partnerId))
    {
        const confirmed = confirm(`Are you sure you want to delete partner: ID `+partner.partnerId+`- all related data will be lost!`);

        if (!confirmed) {
            alert("Partner deletion cancelled");
            return;
        }

        console.log(partner.partnerId);
        deletePartnerFromDB(partner);
        alert("Partner Deleted");

        document.getElementById("DP").reset();

        return;
    }
    else
    {
        alert("Partner ID does not exist");
        return;
    }
}

/*Validation*/

const industries = ["agriculture","construction","education","energy","finance","healthcare",
    "hospitality", "manufacturing", "media", "professional_services", "real_estate",
    "retail","technology","telecommunications","transportation","individual","government"];

function checkFieldsNotEmpty(partner){// used in edit and delete to ensure fields arent empty

    if(partner.partnerName == "" || partner.partnerAidDesc == "" || partner.sector == "" || partner.postcode == "")
    {
        console.log("No data in fields");
        return false;
    }
    else
    {
        console.log("Fields contain data");
        return true;
    }
}

async function validatePartner(partner){//used in edit and delete to ensure fields are valid

    if(partner.partnerName.length <= 30)
    {
        if(partner.partnerAidDesc.length <= 30)
        {
            const allPostcodes = (await returnPostcodes()).data;
                console.log(allPostcodes);
                console.log([partner.postcode]);
                let validCode =false;
                for(let i=0;i<allPostcodes.length;i++)
                {
                    if(allPostcodes[i].postcode == partner.postcode)
                    {
                        validCode = true;
                        console.log("postcode is in list")
                    }
                }


                if(validCode == true)
                {
                    console.log("Validation works");
                    return true;
                }
                else
                {
                    alert("Invalid postcode");
                    return false;
                }
        }
        else
        {
            alert("Aid description is too long");
            return false;
        }
    }
    else
    {
        alert("Partner name is too long");
        return false;
    }

}

async function uniqueNameAdd(name)//used in add screen to ensure name is unique, doesnt include current partners name
{
    let allNames = (await returnPartnerNames()).data.map(x => x.partnerName);
    if(allNames.includes(name))
    {
        alert("name exists");
        return false;
    }
    else
    {
        return true;
    }
}

async function uniqueNameEdit(name)//used in edit screen to ensure name is unique, doesnt include current partners name
{
    let allNames = (await returnPartnerNamesMinusCurrent(name)).data.map(x => x.partnerName);
    if(allNames.includes(name))
    {
        alert("name exists");
        return false;
    }
    else
    {
        return true;
    }
}

async function IdExists(id)//used in delete to ensure ID exists
{
    let allIds = (await returnPartnerIds()).data;

    let idList = allIds.map(x => x.partnerId.toString());

    if(idList.includes(id)){return true;}
    else{return false;}
}

/*SQL methods*/
const addPartnerToDB = async(partner) => {

    /*Relevant SQL statement */
    const sqlAdd = `INSERT INTO tblPartner(partnerName, partnerAidDesc, sector, postcode) VALUES('${partner.partnerName}','${partner.partnerAidDesc}','${partner.sector}','${partner.postcode}');`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php", 
        {method: "POST", body : new URLSearchParams({ query: sqlAdd })}); 
        
        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }


        const result = await response.json();
        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while adding partner:", err);
        return null;
    }
}

const editPartnerInDB = async(partner) => {

    /*Relevant SQL statement */
    const sqlEdit = `UPDATE tblPartner SET partnerName = '${partner.partnerName}', partnerAidDesc = '${partner.partnerAidDesc}', sector = '${partner.sector}', postcode = '${partner.postcode}' WHERE partnerId = ${partner.partnerId};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlEdit })});/*connects the sql statement/web page to the database via the dbconnector*/

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while updating partner:", err);
        return null;
    } 
}

const deletePartnerFromDB = async(partner) => {

    const sqlDelete = `DELETE FROM tblPartner WHERE partnerId = ${partner.partnerId};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlDelete })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while deleting partner:", err);
        return null;
    } 
}

/*The following are methods required for validation regarding checking if fields exist, or if they are unique*/

const returnPostcodes = async () => {

    const sqlReturnAllPostcodes = "SELECT postcode FROM tblArea;";

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnAllPostcodes })});

         if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        console.log(result);
        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching postcodes:", err);
        return null;
    } 
}

const returnPartnerIds = async() => {

    const sqlReturnPartnerIds = "SELECT partnerId FROM tblPartner ORDER BY partnerId ASC;";

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerIds })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching partner IDs:", err);
        return null;
    } 
}

const returnPartnerNames = async() => {

    const sqlReturnPartnerNames = "SELECT partnerName FROM tblPartner ORDER BY partnerId ASC;";

    try
    {
         const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerNames })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching partner names:", err);
        return null;
    } 
}

const returnPartnerNamesMinusCurrent = async(name) => {

    const sqlReturnPartnerNames = `SELECT partnerName FROM tblPartner WHERE partnerName !='${name}' ORDER BY partnerId ASC; `;

    try
    {
         const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerNames })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching partner names:", err);
        return null;
    } 
}

/*The following are methods used for the partner table */

const returnAllPartners = async() => {

    const sqlReturnPartnerNames = "SELECT * FROM tblPartner;";

    try
    {
         const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerNames })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching partner names:", err);
        return null;
    } 
}


const filterPartnersName = async(name) => {

    const sqlReturnPartnerNames = `SELECT * FROM tblPartner WHERE partnerName LIKE '%${name}%';`;

    try
    {
         const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerNames })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();

        updateTable(result.data);
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while fetching partner names:", err);
        return null;
    } 
}

const returnPartnerById = async(Id) => {

    const sqlReturnPartnerId = `SELECT * FROM tblPartner WHERE tblPartner.partnerId = ${Id};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnPartnerId })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

    return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while retrieving partner by ID:", err);
        return null;
    } 
}

async function fetchTablesData()
{//COUNT OF PARTNERS BY AREA
     const sqlFetchData = `SELECT tblPartner.postCode, COUNT(tblPartner.partnerId) AS partnerCount FROM tblPartner GROUP BY tblPartner.postCode ORDER BY partnerCount DESC;`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlFetchData })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

    return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while retrieving Table Data:", err);
        return null;
    } 
}

async function drawChart() {
	// https://www.chartjs.org/docs/latest/general/data-structures.html
	// https://www.w3schools.com/js/js_graphics_chartjs.asp
	const ctx = document.getElementById("myCanvas").getContext("2d");;
	const result = await fetchTablesData();
    const tableData = result.data;

    const postcodesLabels = tableData.map(row => row.postCode);
    const partnerCounts = tableData.map(row => Number(row.partnerCount));

    console.log(tableData);
	
	const myChart = new Chart(ctx, 
    {
		type: 'bar',
		data: {
			labels:  postcodesLabels,
			datasets: [{
                label : "Number of Partners",
				data: partnerCounts, // actual data to be shown belongs here
				
                backgroundColor: [
                "rgba(30, 136, 229, 0.7)",   // mid blue
                "rgba(25, 118, 210, 0.7)",   // deeper blue
                "rgba(21, 101, 192, 0.7)",   // navy blue
                "rgba(13, 71, 161, 0.7)",    // darker navy
                "rgba(2, 119, 189, 0.7)"],
                borderColor: "rgba(255,255,255,0.8)",

				borderWidth: 0,
                barThickness: 30
			}]
		},
		options: { // https://stackoverflow.com/questions/19847582/chart-js-canvas-resize
			responsive: true,
			maintainAspectRatio: false
		}
	});

}