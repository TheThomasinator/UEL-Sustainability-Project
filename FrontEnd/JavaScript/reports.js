const reports = {
    report1: `SELECT tblArea.postCode AS 'Post Code', tblArea.areaName AS 'Area Name', tblArea.noOfBusinesses AS 'Number of Businesses', COUNT(DISTINCT tblBusiness.businessId) AS "Registered Businesses",
COUNT(DISTINCT tblPartner.partnerId) AS "Registered Partners", 
(SELECT sustainabilityStatus FROM tblBusiness WHERE tblBusiness.postCode = tblArea.postCode GROUP BY sustainabilityStatus ORDER BY COUNT(*) DESC LIMIT 1) AS 'Area Sustainability Status', 
(SELECT COUNT(*) FROM tblBusiness WHERE tblBusiness.postCode = tblArea.postCode AND tblBusiness.sustainabilityGoalReached = 1) AS "Successful Sustainability Goals" 
FROM tblArea 
LEFT JOIN tblBusiness ON tblBusiness.postCode = tblArea.postCode 
LEFT JOIN tblPartner ON tblPartner.postCode = tblArea.postCode 
GROUP BY tblArea.postCode;`,

report2: `SELECT tblBusiness.businessName AS 'Business Name', DATE(tblBusiness.sustainabilityGoalDate) AS 'Sustainability Goal Date', tblSession.sessionType AS 'Session Type', tblSession.sessionName AS 'Session Name', 
tblSession.attendanceCount AS 'Number Present', CONCAT(tblResearcher.researcherForename, ' ', tblResearcher.researcherSurname) AS 'Researcher Name',
tblResearcher.researcherRole AS 'Researcher Role', CONCAT('Email: ',tblResearcher.researcherEmail, 'Phone: ', tblResearcher.researcherTelephone) AS 'Contact Details'
FROM tblSession
INNER JOIN tblResearcher ON tblResearcher.researcherId = tblSession.researcherId
LEFT JOIN tblBusiness ON tblBusiness.businessId = tblSession.businessId
ORDER BY tblBusiness.businessId ASC`,

    report3: `SELECT CONCAT(tblResearcher.researcherForename, ' ', tblResearcher.researcherSurname) AS "Researcher Name", tblResearcher.researcherRole AS "Researcher Role", 
CONCAT('Email: ',tblResearcher.researcherEmail, ' Phone: ', tblResearcher.researcherTelephone) AS "Contact Details",
COUNT(DISTINCT tblProject.projectId) AS "Associated Projects",
COUNT(DISTINCT tblPublication.publicationId) AS "Associated Publications",
COUNT(DISTINCT tblSession.sessionId) AS "Sessions Taken"
FROM tblResearcher
LEFT JOIN tblSession ON tblSession.researcherId = tblResearcher.researcherId
INNER JOIN tblResearcherPublication ON tblResearcherPublication.researcherId = tblResearcher.researcherId
INNER JOIN tblPublication ON tblPublication.publicationId = tblResearcherPublication.publicationId
INNER JOIN tblResearcherProject ON tblResearcherProject.researcherId = tblResearcher.researcherId
INNER JOIN tblProject ON tblProject.projectId = tblResearcherProject.projectId
GROUP BY tblResearcher.researcherId, tblResearcher.researcherRole, tblResearcher.researcherForename, tblResearcher.researcherSurname;`,


//All partners and their most recent project
//Allows a view of what partners might have experience in to determine possible future businesses they can work with
    report4: "SELECT tblPartner.partnerName, tblPartner.partnerAidDesc, tblPartner.sector, tblPartner.postCode, tblArea.areaName, tblProject.projectId, tblProject.projectTitle, tblProject.projectSummary,tblProject.projectStartDate, tblProject.projectLengthDays"
+ " FROM tblPartner"
+" INNER JOIN tblArea"
+" ON tblArea.postCode = tblPartner.postCode"
+" INNER JOIN tblProject" 
+" ON tblProject.projectId = ("
+" SELECT tblProject.projectId"
+" FROM tblProject "
+" WHERE tblProject.partnerId = tblPartner.partnerId"
+" ORDER BY tblProject.projectStartDate DESC, tblProject.projectId DESC"
+" LIMIT 1);",

//Overview of all publications and their associated researchers
//Allows a view of publications info can be gotten from on certain topics
    report5: "SELECT tblPublication.publicationId, tblPublication.publicationTitle, tblPublication.publicationDate, tblPublication.publicationSummary, "
+ "GROUP_CONCAT(CONCAT(tblResearcher.researcherForename, ' ', tblResearcher.researcherSurname) "
+ "ORDER BY tblResearcher.researcherSurname SEPARATOR ', ') AS Researchers "
+ "FROM tblPublication "
+ "LEFT JOIN tblResearcherPublication "
+ "ON tblPublication.publicationId = tblResearcherPublication.publicationId "
+ "LEFT JOIN tblResearcher "
+ "ON tblResearcherPublication.researcherId = tblResearcher.researcherId "
+ "GROUP BY tblPublication.publicationId, tblPublication.publicationTitle, tblPublication.publicationDate, tblPublication.publicationSummary "
+ "ORDER BY tblPublication.publicationDate DESC;",

//All Businesses that have finished their sustainability goal, how many sessions it took and what researchers helped with it
//Allows viewing what businesses suceeded and what it took for them to do it
    report6: "SELECT tblBusiness.businessId, tblBusiness.businessName, " +
"COUNT(DISTINCT tblSession.sessionId) AS SessionCount, " +
"GROUP_CONCAT(DISTINCT CONCAT(tblResearcher.researcherForename, ' ', tblResearcher.researcherSurname) " +
"ORDER BY tblResearcher.researcherSurname SEPARATOR ', ') AS Researchers " +
"FROM tblBusiness " +
"LEFT JOIN tblSession " +
"ON tblBusiness.businessId = tblSession.businessId " +
"LEFT JOIN tblResearcher " +
"ON tblSession.researcherId = tblResearcher.researcherId " +
"WHERE tblBusiness.sustainabilityGoalReached = 1 " +
"GROUP BY tblBusiness.businessId, tblBusiness.businessName " +
"ORDER BY tblBusiness.businessName;",

    report7: `SELECT CONCAT (tblPartner.partnerId, ' - ', tblPartner.partnerName) AS 'Partner Name', tblPartner.partnerAidDesc AS 'Partner Aid Description', tblPartner.sector AS 'Sector', COUNT(DISTINCT tblProject.projectId) AS 'Total Projects',
    (SELECT projectStartDate FROM tblProject WHERE tblProject.partnerId = tblPartner.partnerId ORDER BY projectStartDate DESC LIMIT 1) AS 'Latest Project date',
    tblArea.postCode AS 'Area Postcode', tblArea.areaName AS 'Area Name'
    FROM tblPartner
    LEFT OUTER JOIN tblProject ON tblProject.partnerId = tblPartner.partnerId
    LEFT OUTER JOIN tblArea ON tblPartner.postCode = tblArea.postCode GROUP BY tblPartner.partnerID
    ORDER BY tblPartner.partnerId;`,
  
  
    report8: `SELECT CONCAT (tblArea.postCode, ' - ', tblArea.areaName) AS 'Area', tblArea.noOfBusinesses AS 'Total Businesses',COUNT(DISTINCT tblBusiness.businessId) AS 'Total Registered Businesses', COUNT(tblSession.sessionId) AS 'Total Sessions',
    SUM(tblSession.attendanceCount) AS 'Total Attendance'
    FROM tblArea
    LEFT JOIN tblBusiness ON tblBusiness.postCode = tblArea.postCode
    LEFT JOIN tblSession ON tblSession.businessId = tblBusiness.businessId
    GROUP BY tblArea.postCode
    ORDER BY SUM(tblSession.attendanceCount) DESC;`,
  
  
    report9: `SELECT CONCAT(proj.projectId, ' - ', proj.projectTitle) AS 'Project', proj.projectStartDate AS 'Start Date', proj.projectLengthDays AS 'Duration', proj.projectSummary AS 'Description',
    CONCAT(a.postCode, ' - ', a.areaName) AS 'Area', p.partnerName,
    GROUP_CONCAT(DISTINCT CONCAT(r.researcherForename, ' ', r.researcherSurname) SEPARATOR ', ') AS 'Researchers', 
    COUNT(DISTINCT pub.publicationId) AS 'Related publications'
    FROM tblProject proj
    JOIN tblPartner p ON proj.partnerId = p.partnerId
    JOIN tblArea a ON a.postCode = p.postCode
    LEFT JOIN tblResearcherProject rp ON proj.projectId = rp.projectId
    LEFT JOIN tblResearcher r ON r.researcherId = rp.researcherId
    LEFT JOIN tblResearcherPublication rpub ON rpub.researcherId = r.researcherId
    LEFT JOIN tblPublication pub ON pub.publicationId = rpub.publicationId
    GROUP BY proj.projectId
    ORDER BY proj.projectStartDate DESC;
     `,
  
    report10: `SELECT 
			b.businessName AS 'Business Name',
			b.sustainabilityGoal AS 'Sustainability Goal',
			b.sustainabilityGoalDate AS 'Sustainability Goal Date',
			DATEDIFF(b.sustainabilityGoalDate, CURDATE()) AS 'Days Remaining',
			COUNT(s.sessionId) AS 'Sessions Attended'
		FROM tblBusiness b
		LEFT JOIN tblSession s ON s.businessId = b.businessId
		WHERE b.sustainabilityGoalReached = 0 AND DATEDIFF(b.sustainabilityGoalDate, CURDATE()) <= 30
		GROUP BY b.businessId
		ORDER BY DATEDIFF(b.sustainabilityGoalDate, CURDATE()) ASC;`,
  
    report11: `SELECT 
			p.partnerName AS 'Partner Name',
			p.sector AS 'Sector',
			COUNT(pr.projectId) AS 'Total Projects',
			AVG(pr.projectLengthDays) AS 'Average Project Length'
		FROM tblPartner p
		INNER JOIN tblProject pr ON pr.partnerId = p.partnerId
		GROUP BY p.partnerId
		ORDER BY COUNT(pr.projectId) DESC;`,
  
    report12: `SELECT 
			CONCAT(r.researcherForename, ' ', r.researcherSurname) AS 'Researcher Name',
			COUNT(DISTINCT s.sessionId) AS 'No. of Sessions Run',
			COUNT(DISTINCT rp.publicationId) AS 'No. of Publications Produced'
		FROM tblResearcher r
		LEFT JOIN tblSession s ON s.researcherId = r.researcherId
		LEFT JOIN tblResearcherPublication rp ON rp.researcherId = r.researcherId
		GROUP BY r.researcherId
		ORDER BY COUNT(DISTINCT rp.publicationId) DESC;`,
  
    report13: `SELECT busi.businessId AS 'Business ID',
    busi.businessName AS 'Business Name',
    busi.sustainabilityStatus AS 'Sustainability Status',
    busi.sustainabilityGoalReached AS 'Goal Reached',
    COUNT(sess.sessionId) AS 'Total Sessions'
        FROM tblBusiness busi LEFT JOIN tblSession sess ON busi.businessId = sess.businessId
        GROUP BY busi.businessId
        HAVING COUNT(sess.sessionId) > 0
        ORDER BY COUNT(sess.sessionId) DESC;`,
    report14: `SELECT sess.sessionType AS 'Delivery Mode',
    COUNT(sess.sessionId) AS 'Total Sessions',
    SUM(sess.attendanceCount) AS 'Total Attendance',
    AVG(sess.attendanceCount) AS 'Average Attendance',
    busi.sustainabilityStatus AS 'Business Sustainability Status'
        FROM tblSession sess
        INNER JOIN tblBusiness busi ON sess.businessId = busi.businessId
        GROUP BY busi.sustainabilityStatus, sess.sessionType
        ORDER BY FIELD(busi.sustainabilityStatus, 'Green', 'Amber', 'Red'),
        sess.sessionType;`,
    report15: `SELECT YEAR(publicationDate) AS 'Year',
    COUNT(*) AS 'Total Publications'
        FROM tblPublication
        GROUP BY YEAR(publicationDate)
        ORDER BY YEAR(publicationDate);`
};

const getReport = async (sql) => {
    const response = await fetch('https://mbyrne44.webhosting1.eeecs.qub.ac.uk/dbConnector.php', {
        method: "POST",
        body: new URLSearchParams({ query: sql })
    });

    const result = await response.json();
    console.log(result);
    return result.data;
};

const displayReport = async (sql) => {
    const data = await getReport(sql);
    const container = document.getElementById("report");

	document.getElementById("top-of-report").scrollIntoView({ // to scroll down to the reports smoothly. placed up here so even if no results, you scroll down to see the no results.
		behavior: 'smooth',
		block: 'center',
	});

    if (data.length === 0) {
        container.textContent = "No Results";
        return;
    }

    let html = "<table border = 1><tr>";

    const columns = Object.keys(data[0]);

    columns.forEach(col => {
        html += `<th>${col}</th>`;
    })

    html += "</tr>";

    data.forEach(row => {
        html += "<tr>";
        columns.forEach(col => {
            html += `<td>${row[col]}</td>`;
        })
        html += "</tr>";
    });

    html += "</table>";
    container.innerHTML = html;
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".report-button").forEach(btn => {
        btn.addEventListener("click", () => {
            console.log("Button Clicked...")
            const reportName = btn.dataset.report;
            const sql = reports[reportName];
            console.log("Report name:", reportName);
            console.log("SQL:", sql);
            displayReport(sql);
        });
    });
});