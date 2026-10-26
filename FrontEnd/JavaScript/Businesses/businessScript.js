console.log("JS file loaded");

document.addEventListener("DOMContentLoaded", event => //initializes various page items upon the HTML loading
    {console.log("DOM content loaded");
        createListeners();//creates AED listeners
        initializeTable();//adds all businesses to table
        initializeFilterListeners();//initializes listeners for the form that filters the table
        initializeComboboxPostcode();//initializes comboboxes containing postcodes
        initializeComboboxIDs();//initializes comboboxes containing business IDs
        initializeCbxChangeListener();//initializes the ability to automatically enter data based on ID
        drawChart();//initializes the chart in the read page
    });

    let allBusinesses = [];

function createListeners()
{
    document.getElementById("AB").addEventListener("submit", handleAdd); /*event listener for add page */

    document.getElementById("EB").addEventListener("submit", handleEdit); /*event listener for edit page */

    document.getElementById("DB").addEventListener("submit", handleDelete); /*event listener for delete page */
}

async function initializeTable()
{
    const businesses = (await returnAllBusinesses()).data;
    console.log(allBusinesses);

    allBusinesses = businesses;
    updateTable(allBusinesses);
}

function initializeFilterListeners()
{
    document.getElementById("businessNameInput").addEventListener("input", filterTable);
    document.getElementById("sustainabilityGoalInput").addEventListener("input", filterTable);
    document.getElementById("sustainabilityGoalDateInput").addEventListener("input", filterTable);
    document.getElementById("openingDateInput").addEventListener("input", filterTable);

    document.getElementById("statusInput").addEventListener("input", filterTable);
    document.getElementById("sustainabilityGoalReachedInput").addEventListener("input", filterTable);
    document.getElementById("postcodeBoxRead").addEventListener("input", filterTable);
    document.getElementById("businessEmailInput").addEventListener("input", filterTable);
    document.getElementById("businessTelephoneInput").addEventListener("input", filterTable);
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

async function initializeComboboxIDs()//initializes the comboboxes containing the business IDs on the edit and delete page
{
    console.log("method called");
    const allIds = (await returnBusinessIds()).data;
    const allNames = (await returnBusinessNames()).data;

    console.log(allIds);
    
    const cbx1 = document.getElementById("editBusinessId");
    const cbx2 = document.getElementById("deleteBusinessId");

    for(let i=0; i<allIds.length;i++)
    {
        const IdOption1 = document.createElement("option");
        IdOption1.value = allIds[i].businessId;
        IdOption1.textContent = allIds[i].businessId+ " "+ allNames[i].businessName;

        const IdOption2 = document.createElement("option");
        IdOption2.value = allIds[i].businessId;
        IdOption2.textContent = allIds[i].businessId + " "+ allNames[i].businessName;

        cbx1.add(IdOption1);
        cbx2.add(IdOption2);
    }
}

function initializeCbxChangeListener()
{
    document.getElementById("editBusinessId").addEventListener("input", () => {displayEditData(document.getElementById("editBusinessId").value)});
    document.getElementById("deleteBusinessId").addEventListener("input", () => {displayDeleteData(document.getElementById("deleteBusinessId").value)});
}


async function displayEditData(businessId)//adds fields to the form on the edit page when a given ID is chosen
{
    const business = (await returnBusinessById(businessId)).data;
    console.log(businessId);

    const nameBox = document.getElementById("editBusinessName");
    const susGoalBox = document.getElementById("editSustainabilityGoal");
    const susGoalDateBox = document.getElementById("editSustainabilityGoalDate");
    const openDateBox = document.getElementById("editOpeningDate");
    const susStatusBox = document.getElementById("editSustainabilityStatus");
    const susGoalReachedBox = document.getElementById("editSustainabilityGoalReached");
    const postcodeBox = document.getElementById("postcodeBoxEdit");
    const emailBox = document.getElementById("editBusinessEmail");
    const telephoneBox = document.getElementById("editBusinessTelephone");


    nameBox.textContent = business[0].businessName;
    nameBox.value = business[0].businessName;

    susGoalBox.textContent = business[0].sustainabilityGoal;
    susGoalBox.value = business[0].sustainabilityGoal;   

    susGoalDateBox.value = business[0].sustainabilityGoalDate;   

    openDateBox.value = business[0].openingDate;   

    susStatusBox.value = business[0].sustainabilityStatus;  
    
    susGoalReachedBox.checked = business[0].sustainabilityGoalReached ==1;
    
    emailBox.textContent = business[0].businessEmail;
    emailBox.value = business[0].businessEmail;

    telephoneBox.textContent = business[0].businessTelephone;
    telephoneBox.value = business[0].businessTelephone;
    
    postcodeBox.value = business[0].postCode;
}

async function displayDeleteData(businessId)//adds fields to the form on the delete page when a given ID is chosen
{
    const business = (await returnBusinessById(businessId)).data;
    console.log(businessId);

    const nameBox = document.getElementById("deleteBusinessName");
    const susGoalBox = document.getElementById("deleteSustainabilityGoal");
    const susGoalDateBox = document.getElementById("deleteSustainabilityGoalDate");
    const openDateBox = document.getElementById("deleteOpeningDate");
    const susStatusBox = document.getElementById("deleteSustainabilityStatus");
    const susGoalReachedBox = document.getElementById("deleteSustainabilityGoalReached");
    const postcodeBox = document.getElementById("postcodeBoxDelete");
    const emailBox = document.getElementById("deleteBusinessEmail");
    const telephoneBox = document.getElementById("deleteBusinessTelephone");


    nameBox.textContent = business[0].businessName;
    nameBox.value = business[0].businessName;

    susGoalBox.textContent = business[0].sustainabilityGoal;
    susGoalBox.value = business[0].sustainabilityGoal;   

    susGoalDateBox.value = business[0].sustainabilityGoalDate;   

    openDateBox.value = business[0].openingDate;   

    susStatusBox.value = business[0].sustainabilityStatus;  
    
    susGoalReachedBox.checked = business[0].sustainabilityGoalReached ==1;
   
    emailBox.textContent = business[0].businessEmail;
    emailBox.value = business[0].businessEmail;

    telephoneBox.textContent = business[0].businessTelephone;
    telephoneBox.value = business[0].businessTelephone;
    
    postcodeBox.value = business[0].postCode;
}

function filterTable()//upon changes in the form being detected, the table is filtered in accordance with the contents of the form
{
    const nameFilter = document.getElementById("businessNameInput").value.toLowerCase();
	const goalFilter = document.getElementById("sustainabilityGoalInput").value.toLowerCase();
	const goalDateFilter = document.getElementById("sustainabilityGoalDateInput").value;
    const openingDateFilter = document.getElementById("openingDateInput").value;
    const statusFilter = document.getElementById("statusInput").value.toLowerCase();
	const goalReachedFilter = document.getElementById("sustainabilityGoalReachedInput").checked;
	const postcodeFilter = document.getElementById("postcodeBoxRead").value.toUpperCase();
    const emailFilter = document.getElementById("businessEmailInput").value.toUpperCase();
    const phoneFilter = document.getElementById("businessTelephoneInput").value.toLowerCase();

	const filteredRows = allBusinesses.filter(business => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	const matchesName = business.businessName.toLowerCase().includes(nameFilter);
	const matchesGoal = business.sustainabilityGoal.toLowerCase().includes(goalFilter);
    const matchesGoalDate = business.sustainabilityGoalDate.toLowerCase().includes(goalDateFilter);
    const matchesOpeningDate = business.openingDate.toLowerCase().includes(openingDateFilter);
    const matchesStatus = business.sustainabilityStatus.toLowerCase().includes(statusFilter);
    const matchesGoalReached = !goalReachedFilter || business.sustainabilityGoalReached === '1';
	const matchesPostcode = business.postCode.toUpperCase().includes(postcodeFilter);
    const matchesEmail = business.businessEmail.toLowerCase().includes(emailFilter);
    const matchesPhone = business.businessTelephone.toLowerCase().includes(phoneFilter);

		return matchesName && matchesGoal && matchesGoalDate && matchesOpeningDate && matchesStatus && matchesGoalReached && matchesPostcode && matchesEmail && matchesPhone;
	});
	
	updateTable(filteredRows);
}

function updateTable(businesses)//generic function used to update the table with new data, used in initialization and upon filter form changes
{
    const table = document.getElementById("businessTable");

 while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for(let i=0;i<businesses.length;i++)
        {
            let business = {
            businessId : businesses[i].businessId,
            businessName : businesses[i].businessName,
            sustainabilityGoalDate : businesses[i].sustainabilityGoalDate,
            sustainabilityStatus : businesses[i].sustainabilityStatus,
            sustainabilityGoal : businesses[i].sustainabilityGoal,
            businessEmail : businesses[i].businessEmail,
            businessTelephone : businesses[i].businessTelephone,
            openingDate : businesses[i].openingDate,
            sustainabilityGoalReached: businesses[i].sustainabilityGoalReached,
            postCode: businesses[i].postCode
            }

            const row = table.insertRow();

            row.insertCell().textContent = business.businessId;
            row.insertCell().textContent = business.businessName;
            row.insertCell().textContent = business.sustainabilityGoalDate;
            row.insertCell().textContent = business.sustainabilityStatus;
            row.insertCell().textContent = business.sustainabilityGoal;
            row.insertCell().textContent = business.businessEmail;
            row.insertCell().textContent = business.businessTelephone;
            row.insertCell().textContent = business.openingDate;

            if(business.sustainabilityGoalReached ==1)
            {
                row.insertCell().textContent = "Achieved";
            }
            else
            {
                row.insertCell().textContent = "In Progress";
            }

            row.insertCell().textContent = business.postCode;

            row.addEventListener("click", () => {window.location.href = `businessDetails.html?businessId=${business.businessId}`;});

        }
}

//The following methods are used to handle the Add/Edit/Delete methods upon form submission
async function handleAdd(event){
    event.preventDefault();
    console.log("Method called");

    let business ={
    businessName: document.getElementById("addBusinessName").value,
    sustainabilityGoalDate: document.getElementById("addSustainabilityGoalDate").value,
    sustainabilityStatus: document.getElementById("addSustainabilityStatus").value,
    sustainabilityGoal: document.getElementById("addSustainabilityGoal").value,
    businessEmail: document.getElementById("addBusinessEmail").value,
    businessTelephone: document.getElementById("addBusinessTelephone").value,
    openingDate: document.getElementById("addOpeningDate").value,
    sustainabilityGoalReached: document.getElementById("addSustainabilityGoalReached").checked? 1 : 0,
    postcode: document.getElementById("postcodeBoxAdd").value
    };

    console.log("Fields: "+business.businessName+" "+business.sustainabilityGoalDate+" "+business.sustainabilityStatus+" "+business.sustainabilityGoal+" "+business.businessEmail+" "+business.businessTelephone+" "+business.openingDate+" "+business.sustainabilityGoalReached+" "+business.postcode);

    console.log(business.sustainabilityGoalReached);

    if(checkFieldsNotEmpty(business))
    {
        if(await validateBusiness(business))
        {
            if(await uniqueDetailsAdd(business.businessName, business.businessTelephone, business.businessEmail))
            {
                console.log("Method ready to call");
            
                await addBusinessToDB(business);

                console.log("Business added");
                alert("Business added");

                document.getElementById("AB").reset();
                return;
            }
            else
            {
               alert("Business Name/Telephone/Email must be unique");
               return;
            }
        }
    }
}

async function handleEdit(event){
    event.preventDefault();
    console.log("Method called");

    let business ={
    businessId: document.getElementById("editBusinessId").value,
    businessName: document.getElementById("editBusinessName").value,
    sustainabilityGoalDate: document.getElementById("editSustainabilityGoalDate").value,
    sustainabilityStatus: document.getElementById("editSustainabilityStatus").value,
    sustainabilityGoal: document.getElementById("editSustainabilityGoal").value,
    businessEmail: document.getElementById("editBusinessEmail").value,
    businessTelephone: document.getElementById("editBusinessTelephone").value,
    openingDate: document.getElementById("editOpeningDate").value,
    sustainabilityGoalReached: document.getElementById("editSustainabilityGoalReached").checked? 1 : 0,
    postcode: document.getElementById("postcodeBoxEdit").value
    };

    console.log("Fields: "+business.businessId+" "+business.businessName+" "+business.sustainabilityGoalDate+" "+business.sustainabilityStatus+" "+business.sustainabilityGoal+" "+business.businessEmail+" "+business.businessTelephone+" "+business.openingDate+" "+business.sustainabilityGoalReached+" "+business.postcode);

    if(checkFieldsNotEmpty(business))
    {
        if(validateBusiness(business))
        {
            if(await uniqueDetailsEdit(business.businessName, business.businessTelephone, business.businessEmail))
            {
                console.log("Method ready to call");
            
                editBusinessInDB(business);

                alert("Business edited");

                document.getElementById("EB").reset();

                return;
            }
            else
            {
                alert("Business Name/Telephone/Email must be unique");
                return;
            }
        }
    }
}

function handleDelete(event){
    event.preventDefault();
    console.log("Method called");

    let business ={
    businessId: document.getElementById("deleteBusinessId").value,
    businessName: document.getElementById("deleteBusinessName").value,
    sustainabilityGoalDate: document.getElementById("deleteSustainabilityGoalDate").value,
    sustainabilityStatus: document.getElementById("deleteSustainabilityStatus").value,
    sustainabilityGoal: document.getElementById("deleteSustainabilityGoal").value,
    businessEmail: document.getElementById("deleteBusinessEmail").value,
    businessTelephone: document.getElementById("deleteBusinessTelephone").value,
    openingDate: document.getElementById("deleteOpeningDate").value,
    sustainabilityGoalReached: document.getElementById("deleteSustainabilityGoalReached").checked? 1 : 0,
    postcode: document.getElementById("postcodeBoxDelete").value
    };

    console.log("Fields: "+business.businessId+" "+business.businessName+" "+business.sustainabilityGoalDate+" "+business.sustainabilityStatus+" "+business.sustainabilityGoal+" "+business.businessEmail+" "+business.businessTelephone+" "+business.openingDate+" "+business.sustainabilityGoalReached+" "+business.postcode);

    if(IdExists(business.businessId))
    {
        const confirmed = confirm(`Are you sure you want to delete business: ID `+business.businessId+`- all related data will be lost!`);

        if (!confirmed) {
            alert("Business deletion cancelled");
            return;
        }

        console.log(business.businessId);
        deleteBusinessFromDB(business);
        alert("Business Deleted");

        document.getElementById("DB").reset();
        return;
    }
    else
    {
        alert("Partner ID does not exist");
        return;
    }
}

//the following are validation methods used for Add and Edit. They may be used for both functions, or just one (Note: delete validation not required as the combobox will never contain invalid IDs)

function changeDMYFormat(dmy) //this method puts the dates into the YYYY/MM/DD format so javascript can actually use them. Used in validateBusiness method
{
    const [day, month, year] = dmy.split("/");
    return new Date(`${year}-${month}-${day}`).getTime();
}

async function validateBusiness(business){//used in Add, Edit and Delete to validate fields

    if(business.businessName.length <=30)
    {
        const goalDate = changeDMYFormat(business.sustainabilityGoalDate);
        if(goalDate >= Date.now())
        {
            if(business.sustainabilityStatus === "Red" || business.sustainabilityStatus === "Amber" || business.sustainabilityStatus === "Green")
            {
                if(business.businessEmail.includes("@") && business.businessEmail.includes("."))
                {
                    if((business.businessTelephone.length >= 11 && business.businessTelephone.substring(0,1) == "0")|| ((business.businessTelephone.length <= 14) && business.businessTelephone.substring(0,3) == "+44"))
                    {
                        const openDate = changeDMYFormat(business.openingDate);
                       if(openDate <Date.now())
                       {
                            const allPostcodes = (await returnPostcodes()).data;
                            console.log(allPostcodes);
                            console.log([business.postcode]);
                            let validCode =false;
                            for(let i=0;i<allPostcodes.length;i++)
                            {
                                console.log(allPostcodes[i]);
                                if(allPostcodes[i].postcode == business.postcode)
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
                            alert("Opening Date must be in the past");
                            return false;
                       }
                    }
                    else
                    {
                        alert("Invalid phone number ");
                        return false;
                    }
                }
                else
                {
                    alert("Invalid email format.");
                    return false;
                }
            }
            else
            {
                alert("Invalid sustainability status field.");
                return false;
            }
        }
        else
        {
        alert("Sustainability goal date must be in the future.");
        return false;
        }
    }
    else
    {
        alert("Business Name must be 30 characters or less.");
        return false;
    }
}

function checkFieldsNotEmpty(business){//used in Add and Edit to ensure fields arent empty

    if(business.businessName == "" || business.sustainabilityGoal == "" || business.sustainabilityGoalDate == "" || business.openingDate == ""|| business.sustainabilityStatus == ""|| business.postCode == ""|| business.businessEmail == ""|| business.businessTelephone == "")
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

async function uniqueDetailsAdd(name, telephone, email)//ensures name, telephone and email are unique for the add form
{
    let allNames = (await returnBusinessNames()).data.map(x => x.businessName);
    if(allNames.includes(name))
    {
        alert("name already exists");
        return false;
    }
    else
    {
        let allPhones = (await returnBusinessPhones()).data.map(x => x.businessTelephone);
        if(allPhones.includes(telephone))
        {
            alert("phone number already exists");
            return false;
        }
        else
        {
            let allEmails = (await returnBusinessEmails()).data.map(x => x.businessEmail);
            if(allEmails.includes(email))
            {
                alert("Email already exists");
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}

async function uniqueDetailsEdit(name, telephone, email)//ensures name, telephone and email are unique for edit. this required not including the current name/telephone/email in the event that it isnt changed
{
    let allNames = (await returnBusinessNamesMinusCurrent(name)).data.map(x => x.businessName);
    if(allNames.includes(name))
    {
        alert("name already exists");
        return false;
    }
    else
    {
        let allPhones = (await returnBusinessPhonesMinusCurrent(telephone)).data.map(x => x.businessTelephone);
        if(allPhones.includes(telephone))
        {
            alert("phone number already exists");
            return false;
        }
        else
        {
            let allEmails = (await returnBusinessEmailsMinusCurrent(email)).data.map(x => x.businessEmail);
            if(allEmails.includes(email))
            {
                alert("Email already exists");
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}

async function IdExists(id)//failsafe to check that ID exists, to avoid unexpected errors
{
    let allIds = (await returnBusinessIds()).data;
    if(allIds.includes(id)){return true;}
    else{return false;}
}

//The following are SQL methods used to carry out the Add/Edit/Delete functionality

const addBusinessToDB = async(business) => {//add

    /*Relevant SQL statement */
    const sqlAdd = `INSERT INTO tblBusiness(businessName, sustainabilityGoalDate, sustainabilityStatus, sustainabilityGoal, businessEmail, businessTelephone, openingDate, sustainabilityGoalReached, postCode) VALUES ('${business.businessName}','${business.sustainabilityGoalDate}','${business.sustainabilityStatus}','${business.sustainabilityGoal}','${business.businessEmail}','${business.businessTelephone}','${business.openingDate}','${business.sustainabilityGoalReached}','${business.postcode}');`;

    console.log("SQL SENT:", sqlAdd);


    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlAdd })});/*connects the sql statement/web page to the database via the dbconnector*/

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if(result.success == "true")
        {
            console.log("addBusiness succeeded");
            return result;      
        }
        else
        {
            console.log("addBusiness failed");
            return null;
        }
        
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while adding partner:", err);
        return null;
    }
    
}

const editBusinessInDB = async(business) => {//edit

    /*Relevant SQL statement */
    const sqlEdit = `UPDATE tblBusiness SET businessName = '${business.businessName}', sustainabilityGoalDate = '${business.sustainabilityGoalDate}
    ', sustainabilityStatus = '${business.sustainabilityStatus}', sustainabilityGoal = '${business.sustainabilityGoal}', businessEmail = '${business.businessEmail}
    ', businessTelephone = '${business.businessTelephone}', openingDate = '${business.openingDate}', sustainabilityGoalReached = '${business.sustainabilityGoalReached}
    ', postCode = '${business.postcode}' WHERE businessId = ${business.businessId};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlEdit })});

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

const deleteBusinessFromDB = async(business) => {//delete

    /*Relevant SQL statement */
    const sqlDelete = `DELETE FROM tblBusiness WHERE businessId = ${business.businessId};`

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
        console.error("Error while adding partner:", err);
        return null;
    }
}


/*The following are methods required for validation regarding checking if fields exist, or if they are unique, the names are self-explanatory*/

const returnPostcodes = async() => {

    /*Relevant SQL statement */
    const sqlReturnAllPostcodes = "SELECT postcode FROM tblArea;"

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnAllPostcodes })});

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

const returnBusinessIds = async() => {

    /*Relevant SQL statement */
    const sqlReturnBusinessIds = "SELECT businessId FROM tblBusiness ORDER BY businessId ASC;"

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnBusinessIds })});

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

const returnBusinessNames = async() => {

    /*Relevant SQL statement */
    const sqlReturnBusinessNames = "SELECT businessName FROM tblBusiness ORDER BY businessId ASC;"

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnBusinessNames })});

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

const returnBusinessPhones = async() => {

    /*Relevant SQL statement */
    const sqlReturnBusinessNames = "SELECT businessTelephone FROM tblBusiness;"

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnBusinessNames })});

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

const returnBusinessEmails = async() => {

    /*Relevant SQL statement */
    const sqlReturnBusinessNames = "SELECT businessEmail FROM tblBusiness;"

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnBusinessNames })});

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

const returnBusinessNamesMinusCurrent = async(name) => {

    const sqlReturnPartnerNames = `SELECT businessName FROM tblBusiness WHERE businessName !='${name}' ORDER BY businessId ASC; `;

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

const returnBusinessPhonesMinusCurrent = async(phone) => {

    const sqlReturnPartnerNames = `SELECT businessTelephone FROM tblBusiness WHERE businessTelephone !='${phone}' ORDER BY businessId ASC; `;

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

const returnBusinessEmailsMinusCurrent = async(email) => {

    const sqlReturnPartnerNames = `SELECT businessEmail FROM tblBusiness WHERE businessEmail !='${email}' ORDER BY businessId ASC; `;

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

const returnAllBusinesses = async() => {

    const sqlReturnPartnerNames = "SELECT * FROM tblBusiness;"

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

const returnBusinessById = async(Id) => {

    /*Relevant SQL statement */
    const sqlReturnBusinessId = `SELECT * FROM  tblBusiness WHERE tblBusiness.businessId = ${Id};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnBusinessId })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while retrieving data:", err);
        return null;
    }
}

async function fetchTablesData()
{//COUNT OF BUSINESS BY AREA
     const sqlFetchData = `SELECT tblBusiness.postCode, COUNT(tblBusiness.businessId) AS businessCount FROM tblBusiness GROUP BY tblBusiness.postCode ORDER BY businessCount DESC;`;

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
    const businessCounts = tableData.map(row => Number(row.businessCount));

    console.log(tableData);
	
	const myChart = new Chart(ctx, 
    {
		type: 'bar',
		data: {
			labels:  postcodesLabels,
			datasets: [{
                label : "Number of Businesses",
				data: businessCounts, // actual data to be shown belongs here
				
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

