console.log("JS file loaded");

/*Event Listeners */
document.addEventListener("DOMContentLoaded", event => 
    {console.log("DOM content loaded");
       initializePage();
       initializeTableProjects();
    });


async function initializeTableProjects()
{
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get("partnerId")//retrieves the partners ID from the URL

    const projects = (await returnRelatedProjects(partnerId)).data;
    console.log(projects);
    const table = document.getElementById("projectTable");
    for(let i=0;i<projects.length;i++)
    {
        let project = {
        projectId : projects[i].projectId,
        projectTitle : projects[i].projectTitle,
        startDate : projects[i].projectStartDate,
        length : projects[i].projectLengthDays,
        summary: projects[i].projectSummary
        }

        const row = table.insertRow();

        row.insertCell().textContent = project.projectId;
        row.insertCell().textContent = project.projectTitle;
        row.insertCell().textContent = project.startDate;
        row.insertCell().textContent = project.length;
        row.insertCell().textContent = project.summary;
    }
    
}

async function initializePage()
{
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get("partnerId")//retrieves the partners ID from the URL

    const partner = (await returnPartnerById(partnerId)).data;
    console.log(partner);

    const aidTypeField = document.getElementById("aidType");
    const sectorField = document.getElementById("roleDesc");
    const postcodeField = document.getElementById("postcode");
    const partnerNameField = document.getElementById("detail-display");

    aidTypeField.textContent += " "+ partner[0].partnerAidDesc;
    sectorField.textContent += " "+partner[0].sector;
    postcodeField.textContent += " "+partner[0].postCode;
    partnerNameField.textContent = partner[0].partnerName;
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

const returnRelatedProjects = async(Id) => {

    const sqlReturnRelatedProjects = `SELECT DISTINCT * FROM tblProject WHERE partnerId = ${Id};`;

    try
    {
        const response = await fetch("https://dgraham49.webhosting1.eeecs.qub.ac.uk/dbConnector.php",
        {method: "POST", body : new URLSearchParams({ query: sqlReturnRelatedProjects })});

        if (!response.ok) { /*response.ok will be true when the HTTP status is between 200 and 299 (statuses that are not errors) */
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("method returns");
        return result;
    }
    catch(err)/*Catches any unexpected errors in a more generic manner than the if statement above */
    {
        console.error("Error while retrieving related projects:", err);
        return null;
    } 
}
