console.log("JS file loaded");

/*Event Listeners */
document.addEventListener("DOMContentLoaded", event => 
    {console.log("DOM content loaded");
       initializePage();
       initializeTableSessions();
    });


async function initializeTableSessions()
{
    const params = new URLSearchParams(window.location.search);
    const businessId = params.get("businessId");//retrieves the business ID from the URL

    const sessions = (await returnUpcomingSessionsById(businessId)).data;
    console.log(sessions);
    const table = document.getElementById("sessionTable");
    for(let i=0;i<sessions.length;i++)
    {
        let session = {
        sessionId : sessions[i].sessionId,
        sessionName : sessions[i].sessionName,
        sessionType : sessions[i].sessionType,
        attendance : sessions[i].attendanceCount,
        researcherId: sessions[i].researcherId,
        researcherForename : sessions[i].researcherForename,
        researcherSurname : sessions[i].researcherSurname
        }

        const row = table.insertRow();

        row.insertCell().textContent = session.sessionId;
        row.insertCell().textContent = session.sessionName;
        row.insertCell().textContent = session.sessionType;
        row.insertCell().textContent = session.attendance;
        row.insertCell().textContent = session.researcherId;
        row.insertCell().textContent = session.researcherForename + " "+ session.researcherSurname;
    }
    
}

async function initializePage()
{
    const params = new URLSearchParams(window.location.search);
    const businessId = params.get("businessId")//retrieves the business ID from the URL

    const business = (await returnBusinessById(businessId)).data;
    console.log(business);

    const businessNameField = document.getElementById("detail-display");
    const postcodeField = document.getElementById("postcode");
    const susStatusField = document.getElementById("susStatus");
    const susGoalField = document.getElementById("susGoal");
    const susDateField = document.getElementById("susDate");
    const susGStatusField = document.getElementById("susGStatus");
    const emailField = document.getElementById("email");
    const telephoneField = document.getElementById("telephone");

    businessNameField.textContent = business[0].businessName;
    postcodeField.textContent += " "+business[0].postCode;
    susStatusField.textContent += " "+business[0].sustainabilityStatus;
    susGoalField.textContent += " "+business[0].sustainabilityGoal;
    susDateField.textContent += " "+business[0].sustainabilityGoalDate;

    if(business[0].sustainabilityGoalReached == 1)
    {
        susGStatusField.textContent += " Achieved";
    }
    else
    {
        susGStatusField.textContent += " In Progress";
    }

    emailField.textContent += " "+business[0].businessEmail;
    telephoneField.textContent += " "+business[0].businessTelephone;
}


const returnUpcomingSessionsById = async(Id) => {

    /*Relevant SQL statement */
    const sqlReturnUpcomingSessions = `SELECT tblSession.sessionId, tblSession.sessionName, tblSession.sessionType, tblSession.attendanceCount, tblSession.researcherId, tblResearcher.researcherForename, tblResearcher.researcherSurname FROM tblSession 
                                        INNER JOIN tblResearcher ON tblSession.researcherId = tblResearcher.researcherId
                                        WHERE tblSession.businessId = ${Id};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnUpcomingSessions })});

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
