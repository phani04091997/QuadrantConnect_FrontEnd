import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ExcelJS from "exceljs"; // Import ExcelJS
import { saveAs } from "file-saver"; // Import FileSaver
import "../css/Resources.css";
import Select from "react-select"; // Import React-Select

const Resources = ({ userType }) => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [queryParameters] = useSearchParams();
  const prevUserType = useRef(userType);
  const [searchOptions, setSearchOptions] = useState([]); // To store selected search fields
  const [searchValues, setSearchValues] = useState({}); // Store values for the selected search fields


  const searchFields = [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "skill", label: "Skill" },
    { value: "joiningDate", label: "Joining Date" },
    { value: "startDate", label: "Start Date" },
    { value: "endDate", label: "End Date" },
  ];

  const handleSearchChange = (selectedOptions) => {
    // Update the selected search fields
    setSearchOptions(selectedOptions || []);
    // Reset values for fields not selected anymore
    setSearchValues((prev) => {
      const updatedValues = {};
      selectedOptions?.forEach((option) => {
        if (prev[option.value]) {
          updatedValues[option.value] = prev[option.value];
        }
      });
      return updatedValues;
    });
  };
  

  const handleSearchValueChange = (field, value) => {
    // Update the value for a specific search field
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  };

  const H1BStatusOptions = [
    { StatusId: 1, StatusName: "Application submitted", StatusType: "h1b" },
    { StatusId: 2, StatusName: "Application selected", StatusType: "h1b" },
    { StatusId: 3, StatusName: "Application not selected", StatusType: "h1b" },
    { StatusId: 4, StatusName: "Ready for screening", StatusType: "h1b" },
    { StatusId: 5, StatusName: "Screening scheduled", StatusType: "h1b" },
    { StatusId: 6, StatusName: "Screening completed", StatusType: "h1b" },
    { StatusId: 7, StatusName: "Resource selected", StatusType: "h1b" },
    { StatusId: 8, StatusName: "Resource not selected", StatusType: "h1b" },
    { StatusId: 9, StatusName: "Yet to submit H1B application to USCIS", StatusType: "h1b" },
    { StatusId: 10, StatusName: "H1B application submitted to USCIS", StatusType: "h1b" },
    { StatusId: 11, StatusName: "Picked in Lottery", StatusType: "h1b" },
    { StatusId: 12, StatusName: "Not picked in Lottery", StatusType: "h1b" },
    { StatusId: 13, StatusName: "Yet to roll offer to Resource", StatusType: "h1b" },
    { StatusId: 14, StatusName: "Rolled offer letter to Resource", StatusType: "h1b" },
    { StatusId: 15, StatusName: "H1B Application filed", StatusType: "h1b" },
    { StatusId: 16, StatusName: "H1B Application not filed", StatusType: "h1b" },
    { StatusId: 17, StatusName: "Stamping documents provided", StatusType: "h1b" },
    { StatusId: 18, StatusName: "Stamping documents not provided", StatusType: "h1b" },
    { StatusId: 19, StatusName: "Ready for stamping", StatusType: "h1b" },
    { StatusId: 20, StatusName: "Visa interview scheduled", StatusType: "h1b" },
    { StatusId: 21, StatusName: "H1B Approved", StatusType: "h1b" },
    { StatusId: 22, StatusName: "H1B Rejected", StatusType: "h1b" },
    { StatusId: 23, StatusName: "H1B RFE", StatusType: "h1b" },
    { StatusId: 24, StatusName: "Ready to move to US", StatusType: "h1b" },
    { StatusId: 25, StatusName: "Traveling", StatusType: "h1b" },
    { StatusId: 26, StatusName: "Moved to US", StatusType: "h1b" },
    { StatusId: 27, StatusName: "Yet to map to project", StatusType: "h1b" },
    { StatusId: 28, StatusName: "Mapped to project", StatusType: "h1b" },
  ];

  // OPT Status Options
  const OPTStatusOptions = [
    { StatusId: 29, StatusName: "Application Submitted", StatusType: "opt" },
    { StatusId: 30, StatusName: "Application Not Selected", StatusType: "opt" },
    { StatusId: 31, StatusName: "Application Selected", StatusType: "opt" },
    { StatusId: 32, StatusName: "Screening Scheduled", StatusType: "opt" },
    { StatusId: 33, StatusName: "Screening Completed", StatusType: "opt" },
    { StatusId: 34, StatusName: "Resource Selected", StatusType: "opt" },
    { StatusId: 35, StatusName: "Resource Not Selected", StatusType: "opt" },
    { StatusId: 36, StatusName: "OnBoarding Initiated", StatusType: "opt" },
    { StatusId: 37, StatusName: "OnBoarded", StatusType: "opt" },
    { StatusId: 38, StatusName: "OffBoarding Initiated", StatusType: "opt" },
    { StatusId: 39, StatusName: "OffBoarded", StatusType: "opt" },
    { StatusId: 40, StatusName: "Under Training", StatusType: "opt" },
    { StatusId: 41, StatusName: "Training Completed", StatusType: "opt" },
    { StatusId: 42, StatusName: "Shadow Project", StatusType: "opt" },
    { StatusId: 43, StatusName: "Mapped to Project", StatusType: "opt" },
    { StatusId: 44, StatusName: "Bench", StatusType: "opt" },
  ];
  


  // Function to export data to Excel
  const exportToExcel = async () => {
  if (resources.length === 0) {
    alert("No resources to export!");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Resources");
  
    // Define common columns
    const columns = [
      { header: "Resource ID", key: "resourceID", width: 15 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Middle Name", key: "middleName", width: 20 },
      { header: "Email ID", key: "emailID", width: 25 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Experience Years", key: "experienceYears", width: 15 },
      { header: "Technical Skills", key: "technicalSkills", width: 30 },
      { header: "Key Summary", key: "keySummary", width: 40 },
      { header: "India Address", key: "currentIndiaAddress", width: 30 },
      { header: "US Address", key: "currentUSAddress", width: 30 },
      { header: "Country of Origin", key: "countryOfOrigin", width: 20 },
      { header: "Resource Type", key: "userType", width: 15 },
    ];
  
    // Dynamically add Year Of Filing for H1B or Work Status, Start Date, End Date for OPT
    if (resources.some((resource) => resource.userType === "H1B")) {
      columns.push({ header: "Year of Filing", key: "yearOfFiling", width: 15 });
    }
    if (resources.some((resource) => resource.userType === "OPT")) {
      columns.push(
        { header: "Work Status", key: "workStatus", width: 20 },
        { header: "Start Date", key: "startDate", width: 15 },
        { header: "End Date", key: "endDate", width: 15 }
      );
    }
  
    // Add the rest of the columns
    columns.push(
      { header: "Joining Date", key: "joiningDate", width: 15 },
      { header: "Exit Date", key: "exitDate", width: 15 },
      { header: "Departure City", key: "departureCity", width: 20 },
      { header: "Arrival City", key: "arrivalCity", width: 20 },
      { header: "Departure Date", key: "departureDate", width: 20 },
      { header: "Arrival Date", key: "arrivalDate", width: 20 },
      { header: "Education Details", key: "educationDetails", width: 40 },
      { header: "Job Details", key: "jobDetails", width: 40 },
      { header: "Referred By", key: "referredBy", width: 20 }
    );
  
    worksheet.columns = columns;
  
    // Add data rows
    resources.forEach((resource) => {
      const rowData = {
        resourceID: resource.resourceID || 0,
        firstName: resource.firstName || "",
        lastName: resource.lastName || "",
        middleName: resource.middleName || "",
        emailID: resource.emailID || "",
        phoneNumber: resource.phoneNumber || "",
        experienceYears: resource.experienceYears || 0,
        technicalSkills: resource.technicalSkills?.join(", ") || "",
        keySummary: resource.keySummary || "",
        currentIndiaAddress: resource.currentIndiaAddress || "",
        currentUSAddress: resource.currentUSAddress || "",
        countryOfOrigin: resource.countryOfOrigin || "",
        userType: resource.userType || "",
        joiningDate: resource.joiningDate
          ? new Date(resource.joiningDate).toLocaleDateString()
          : "",
        exitDate: resource.exitDate
          ? new Date(resource.exitDate).toLocaleDateString()
          : "",
        departureCity: resource.departureCity || "",
        arrivalCity: resource.arrivalCity || "",
        departureDate: resource.departureDate
          ? new Date(resource.departureDate).toLocaleDateString()
          : "",
        arrivalDate: resource.arrivalDate
          ? new Date(resource.arrivalDate).toLocaleDateString()
          : "",
        educationDetails: resource.educationDetails
          ?.map(
            (edu) =>
              `Institution: ${edu.institutionName}, Graduation Year: ${edu.graduationYear}, GPA: ${edu.gpa}, Grade: ${edu.grade}`
          )
          .join("; ") || "N/A",
        jobDetails: resource.jobDetails
          ?.map(
            (job) =>
              `Company: ${job.company}, Start Date: ${job.startDate}, End Date: ${job.endDate}, Role: ${job.rolesAndResponsibility}`
          )
          .join("; ") || "N/A",
        referredBy: resource.referredBy || "",
      };
  
      // Add Year Of Filing for H1B
      if (resource.userType === "H1B") {
        rowData.yearOfFiling = resource.yearOfFiling || 0;
      }
  
      // Add Work Status, Start Date, and End Date for OPT
      if (resource.userType === "OPT") {
        rowData.workStatus = resource.workStatus || "";
        rowData.startDate = resource.startDate
          ? new Date(resource.startDate).toLocaleDateString()
          : "";
        rowData.endDate = resource.endDate
          ? new Date(resource.endDate).toLocaleDateString()
          : "";
      }
  
      worksheet.addRow(rowData);
    });
  
    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Resources.xlsx");
    alert("Resources exported successfully!");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Failed to export resources.");
  }
  
};


  const clearActionStates = () => {
    setSelectedResource(null);
    setEditResource(null);
    setSelectedStatus(null);
    setSelectedNotes(null);
  };

  const handleActionClick = (action, resource) => {
    clearActionStates(); 
    switch (action) {
      case "viewDetails":
        setSelectedResource(resource);
        break;
      case "edit":
        handleEditClick(resource);
        break;
      case "changeStatus":
        setSelectedStatus({
          resourceID: resource.resourceID,
          statusId: resource.statusDetails?.[0]?.statusId || "",
          statusName: resource.statusDetails?.[0]?.statusName || "",
          statusType: resource.statusDetails?.[0]?.statusType || "",
        });
        break;
      case "updateNotes":
        setSelectedNotes({
          resourceID: resource.resourceID,
          notes: resource.resourceNotes?.[0]?.notes || "",
          notesTimeStamp: new Date().toISOString(),
        });
        break;
      default:
        break;
    }
  };

  const loadResources = async (userType = null, resetQueryParams = false) => {
    let statusId = queryParameters.get("statusId");
    let resourceType = userType || queryParameters.get("userType");
    let yearOfFiling = queryParameters.get("yearOfFiling");
  
    // Reset query parameters if requested
    if (resetQueryParams) {
      statusId = null;
      yearOfFiling = null;
    }
  
    try {
      let apiUrl;
      let params = {};
  
      if (
        statusId &&
        Object.values(searchValues).every((value) => value === "")
      ) {
        // Case 1: Fetch resources by statusId, resourceType, and yearOfFiling
        apiUrl =
          resourceType === "H1B"
            ? `https://localhost:7078/api/Resource/status/${statusId}/${resourceType}?yearOfFiling=${yearOfFiling}`
            : `https://localhost:7078/api/Resource/status/${statusId}/${resourceType}`;
      } else if (
        Object.values(searchValues).some((value) => value !== "")
      ) {
        // Case 2: Fetch resources based on searchFields and userType
        apiUrl = "https://localhost:7078/api/Resource/search";
  
        // Add dynamic search values to params
        searchFields.forEach((field) => {
          if (searchValues[field.value]) {
            params[field.value] = searchValues[field.value];
          }
        });
        params.userType = resourceType;
        params.yearOfFiling = yearOfFiling;
      } else if (resourceType) {
        // Case 3: Fetch resources by userType and yearOfFiling only
        apiUrl = "https://localhost:7078/api/Resource/search-by-usertype";
        params = { userType: resourceType, yearOfFiling };
      } else {
        // No valid case, return an empty resource list
        setResources([]);
        return;
      }
  
      // Make the API call
      const response = await axios.get(apiUrl, { params });
      const allResources = response.data || [];
      setResources(allResources);
    } catch (error) {
      console.error("Error loading resources:", error);
      setResources([]); // Reset resources in case of error
    }
  };
  
  
  
   // Dynamically set statusOptions based on userType
   useEffect(() => {
    clearActionStates();
    if (userType === "H1B") {
      setStatusOptions(H1BStatusOptions);
    } else if (userType === "OPT") {
      setStatusOptions(OPTStatusOptions);
    } else {
      setStatusOptions([]); 
    }
  }, [userType]);


  useEffect(() => {
    const shouldResetQueryParams =
      prevUserType.current !== userType && queryParameters.get("statusId");
  
    if (shouldResetQueryParams) {
      loadResources(userType, true); // Pass resetQueryParams as true
    } else {
      loadResources(userType); // Load resources based on current userType and search values
    }
  
    prevUserType.current = userType; // Update prevUserType after the effect runs
  }, [userType, searchValues, searchOptions, queryParameters]);

  
  const handleStatusChange = async () => {
    if (!selectedStatus || !selectedStatus.statusId) {
      alert("Please select a status to update.");
      return;
    }
  
    try {
      await axios.post(
        `https://localhost:7078/api/Resource/${selectedStatus.resourceID}/update-status`,
        {
          StatusId: selectedStatus.statusId,
          StatusName: selectedStatus.statusName,
          StatusType: selectedStatus.statusType,
          DateTimeStamp: new Date().toISOString(),
        }
      );
  
      alert("Status updated successfully!");
  
      // Update resources and ensure statusDetails are sorted in descending order
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.resourceID === selectedStatus.resourceID
            ? {
                ...resource,
                statusDetails: [
                  ...(resource.statusDetails || []),
                  {
                    statusId: selectedStatus.statusId,
                    statusName: selectedStatus.statusName,
                    statusType: selectedStatus.statusType,
                    dateTimeStamp: new Date().toISOString(),
                  },
                ].sort(
                  (a, b) => new Date(b.dateTimeStamp) - new Date(a.dateTimeStamp) 
                ),
              }
            : resource
        )
      );
  
      setSelectedStatus(null); 
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  
  const handleNotesChange = async () => {
    if (!selectedNotes || !selectedNotes.notes) {
      alert("Please enter notes to update.");
      return;
    }
  
    try {
      await axios.post(
        `https://localhost:7078/api/Resource/${selectedNotes.resourceID}/update-notes`,
        {
          Notes: selectedNotes.notes,
          NotesTimeStamp: new Date().toISOString(),
        }
      );
  
      alert("Notes updated successfully!");
  
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.resourceID === selectedNotes.resourceID
            ? {
                ...resource,
                resourceNotes: [
                  {
                    notes: selectedNotes.notes,
                    notesTimeStamp: new Date().toISOString(),
                  },
                  ...(resource.resourceNotes || []), 
                ],
              }
            : resource
        )
      );
  
      setSelectedNotes(null); 
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to update notes.");
    }
  };
  
  // Handle Delete
  const handleDelete = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await axios.delete(`https://localhost:7078/api/Resource/${resourceId}`);
        alert("Resource deleted successfully");
        const shouldResetQueryParams =
        prevUserType.current !== userType && queryParameters.get("statusId");

        if (shouldResetQueryParams) {
          loadResources(userType, true); 
        } else {
          loadResources(userType); 
        }
      
        prevUserType.current = userType;
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert("Failed to delete resource");
      }
    }
  };

  // Handle Update Resource
  const handleUpdate = async () => {
    if (!editResource) return;
    try {
      const response = await axios.put(
        `https://localhost:7078/api/Resource/${editResource.ResourceID}`,
        editResource
      );
      alert("Resource updated successfully");
      setEditResource(null); // Close edit form
      const shouldResetQueryParams =
        prevUserType.current !== userType && queryParameters.get("statusId");

        if (shouldResetQueryParams) {
          loadResources(userType, true); 
        } else {
          loadResources(userType); 
        }

        prevUserType.current = userType;
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("Failed to update resource");
    }
  };

  // Handle Edit Click
  const handleEditClick = (resource) => {
    setEditResource({
      ResourceID: resource.resourceID || 0,
      FirstName: resource.firstName || "",
      LastName: resource.lastName || "",
      MiddleName: resource.middleName || "",
      EmailID: resource.emailID || "",
      ExperienceYears: resource.experienceYears || 0,
      TechnicalSkills: resource.technicalSkills || [],
      KeySummary: resource.keySummary || "",
      CurrentIndiaAddress: resource.currentIndiaAddress || "",
      CurrentUSAddress: resource.currentUSAddress || "",
      PhoneNumber: resource.phoneNumber || "",
      CountryOfOrigin: resource.countryOfOrigin || "",
      UserType: resource.userType || "",
      WorkStatus: resource.workStatus || "",
      YearOfFiling: resource.yearOfFiling || 0,
      StartDate: resource.startDate || "",
      EndDate: resource.endDate || "",
      JoiningDate: resource.joiningDate || "",
      ExitDate: resource.exitDate || "",
      EducationDetails: resource.educationDetails || [
        {
          EducationID: 0,
          GraduationYear: 0,
          InstitutionName: "",
          GPA: 0,
          Percentage: 0,
          Grade: "",
          Marks: 0,
          EducationDocuments: [],
        },
      ],
      JobDetails: resource.jobDetails?.map((job) => ({
        Company: job.company || "", 
        StartDate: job.startDate || "",
        EndDate: job.endDate || "",
        RolesAndResponsibility: job.rolesAndResponsibility || "",
        LastDesignation: job.lastDesignation || "",
        OfferLetters: job.offerLetters || [],
        RelievingLetters: job.relievingLetters || [],
      })) || [
        {
          Company: "",
          StartDate: "",
          EndDate: "",
          RolesAndResponsibility: "",
          LastDesignation: "",
          OfferLetters: [],
          RelievingLetters: [],
        },
      ],
      ResumeUploads: resource.resumeUploads || [],
      DepartureCity: resource.departureCity || "",
      ArrivalCity: resource.arrivalCity || "",
      DepartureDate: resource.departureDate || "",
      ArrivalDate: resource.arrivalDate || "",
      ReferredBy: resource.referredBy || "",
    });
  };

  // Handle Download
  const handleDownload = async (resourceId, fileType, fileName) => {
    try {
      const response = await axios.get(
        `https://localhost:7078/api/Resource/${resourceId}/download/${fileType}`,
        {
          responseType: "blob", // Fetch the binary data as a blob
        }
      );
  
      const contentType = response.headers["content-type"];
      const extension = contentType === "application/pdf" ? ".pdf" : ".file";
  
      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement("a");
      link.href = url;
  
      // Use the provided filename or a default one with the correct extension
      link.setAttribute("download", fileName || `${fileType}_${resourceId}${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      alert(`${fileType} downloaded successfully as ${fileName || `${fileType}_${resourceId}${extension}`}`);
    } catch (error) {
      console.error(`Error downloading ${fileType}:`, error);
      alert(`Failed to download ${fileType}`);
    }
  };

  return (
    <div className="resources-tab">
      <h2>Resources</h2>
      <div className="search-bar">
        {/* Multi-Select Dropdown for Search Fields */}
        <Select
          isMulti
          options={searchFields}
          value={searchOptions}
          onChange={handleSearchChange}
          placeholder="Select fields to search"
        />

        {/* Dynamically Render Inputs for Selected Search Fields */}
        {searchOptions.map((option) => (
          <div key={option.value}>
            {["joiningDate", "startDate", "endDate"].includes(option.value) ? (
              // Render date input for joiningDate, startDate, and endDate
              <input
                type="date"
                placeholder={`Search by ${option.label}`}
                value={searchValues[option.value] || ""}
                onChange={(e) => handleSearchValueChange(option.value, e.target.value)}
              />
            ) : (
              // Render text input for firstName, lastName, and skill
              <input
                type="text"
                placeholder={`Search by ${option.label}`}
                value={searchValues[option.value] || ""}
                onChange={(e) => handleSearchValueChange(option.value, e.target.value)}
              />
            )}
          </div>
        ))}

    {/* Export to Excel Button */}
    <button onClick={exportToExcel}>Export Data to Excel</button>
  </div>

      {/* Resources Table */}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Skill</th>
            <th>Status</th>
            <th>Resource Type</th>
            {resources.some((resource) => resource.userType === "H1B") && <th>Year Of Filing</th>}
            {resources.some((resource) => resource.userType === "OPT") && (
              <>
                <th>Work Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan="9">No resources found</td>
            </tr>
          ) : (
            resources.map((resource, index) => (
              <tr key={`${resource.resourceID}-${index}`}>
                <td>{resource.firstName || "N/A"}</td>
                <td>{resource.lastName || "N/A"}</td>
                <td>{resource.technicalSkills?.join(", ") || "N/A"}</td>
                <td>{resource.statusDetails?.[resource.statusDetails.length - 1]?.statusName || "N/A"}</td>
                <td>{resource.userType || "N/A"}</td>
            
                {resource.userType === "H1B" && <td>{resource.yearOfFiling || "N/A"}</td>}
            
                {resource.userType === "OPT" && (
                  <>
                    <td>{resource.workStatus && resource.workStatus !== "string" ? resource.workStatus : "N/A"}</td>
                    <td>{resource.startDate ? new Date(resource.startDate).toLocaleDateString() : "N/A"}</td>
                    <td>{resource.endDate ? new Date(resource.endDate).toLocaleDateString() : "N/A"}</td>
                  </>
                )}
                <td>
                  <button onClick={() => handleActionClick("viewDetails", resource)}>View Details</button>
                  <button onClick={() => handleActionClick("edit", resource)}>Edit</button>
                  <button onClick={() => handleDelete(resource.resourceID)}>Delete</button>
                  <button onClick={() => handleActionClick("changeStatus", resource)}>Change Status</button>
                  <button onClick={() => handleActionClick("updateNotes", resource)}>Update Notes</button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>


      {/* Selected Resource Details */}
      {selectedResource && (
        <div className="resource-details">
          <h4>Resource Details</h4>
          <div className="section">
          <p>
            <strong>Resource Type:</strong>{" "}
            {selectedResource.userType !== "string" && selectedResource.userType !== null
              ? selectedResource.userType
              : ""}
          </p>
            
          {/* Conditionally Render WorkStatus */}
          {selectedResource.userType === "OPT" && (
            <>
              <p>
                <strong>Work Status:</strong>{" "}
                {selectedResource.workStatus && selectedResource.workStatus !== "string"
                  ? selectedResource.workStatus
                  : "N/A"}
              </p>
                
              {/* Dynamically Render Start Date and End Date Labels */}
              {selectedResource.workStatus && (
                <>
                  <p>
                    <strong>
                      {selectedResource.workStatus === "OPT"
                        ? "OPT Start Date"
                        : selectedResource.workStatus === "Stem OPT"
                        ? "Stem OPT Start Date"
                        : selectedResource.workStatus === "CPT"
                        ? "CPT Start Date"
                        : selectedResource.workStatus === "Day 1 CPT"
                        ? "Day 1 CPT Start Date"
                        : "Start Date"}
                      :
                    </strong>{" "}
                    {selectedResource.startDate
                      ? new Date(selectedResource.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>
                      {selectedResource.workStatus === "OPT"
                        ? "OPT End Date"
                        : selectedResource.workStatus === "Stem OPT"
                        ? "Stem OPT End Date"
                        : selectedResource.workStatus === "CPT"
                        ? "CPT End Date"
                        : selectedResource.workStatus === "Day 1 CPT"
                        ? "Day 1 CPT End Date"
                        : "End Date"}
                      :
                    </strong>{" "}
                    {selectedResource.endDate
                      ? new Date(selectedResource.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </>
              )}
            </>
          )}

          {selectedResource.userType === "H1B" && (
            <p>
              <strong>Year Of Filing:</strong>{" "}
              {selectedResource.yearOfFiling !== "string" && selectedResource.yearOfFiling !== null
                ? selectedResource.yearOfFiling
                : "N/A"}
            </p>
          )}


          <p><strong>First Name:</strong> {selectedResource.firstName !== "string" && selectedResource.firstName !== null ? selectedResource.firstName : ""}</p>
          <p><strong>Middle Name:</strong> {selectedResource.middleName !== "string" && selectedResource.middleName !== null ? selectedResource.middleName : ""}</p>
          <p><strong>Last Name:</strong> {selectedResource.lastName !== "string" && selectedResource.lastName !== null ? selectedResource.lastName : ""}</p>
          <p><strong>Email ID:</strong> {selectedResource.emailID !== "string" && selectedResource.emailID !== null ? selectedResource.emailID : ""}</p>
          <p><strong>Phone Number:</strong> {selectedResource.phoneNumber !== "string" && selectedResource.phoneNumber !== null ? selectedResource.phoneNumber : ""}</p>
          <p><strong>Skills:</strong> {selectedResource.technicalSkills?.filter(skill => skill !== "string").join(", ") || ""}</p>
          <p><strong>Experience Years:</strong> {selectedResource.experienceYears || ""}</p>
          <p><strong>Address (India):</strong> {selectedResource.currentIndiaAddress !== "string" && selectedResource.currentIndiaAddress !== null ? selectedResource.currentIndiaAddress : ""}</p>
          <p><strong>Address (US):</strong> {selectedResource.currentUSAddress !== "string" && selectedResource.currentUSAddress !== null ? selectedResource.currentUSAddress : ""}</p>
          <p><strong>Key Summary:</strong> {selectedResource.keySummary !== "string" && selectedResource.keySummary !== null ? selectedResource.keySummary : ""}</p>
          <p><strong>Referred By:</strong> {selectedResource.referredBy !== "string" && selectedResource.referredBy !== null ? selectedResource.referredBy : ""}</p>
          <p><strong>Joining Date:</strong>{" "}{selectedResource.joiningDate? new Date(selectedResource.joiningDate.split("T")[0]).toLocaleDateString(): "N/A"}</p>
          <p><strong>Exit Date:</strong> {selectedResource.exitDate ? new Date(selectedResource.exitDate).toLocaleString() : "N/A"}</p>
          </div>
      
          {/* Education Details */}
          <h4>Education Details</h4>
          {selectedResource?.educationDetails?.length > 0 ? (
            selectedResource.educationDetails.map((education, index) => (
              <div key={index} className="section">
                <p><strong>Institution Name:</strong> {education.institutionName !== "string" ? education.institutionName : ""}</p>
                <p><strong>Graduation Year:</strong> {education.graduationYear || ""}</p>
                <p><strong>GPA:</strong> {education.gpa || ""}</p>
                <p><strong>Percentage:</strong> {education.percentage || ""}</p>
                <p><strong>Grade:</strong> {education.grade || ""}</p>
                <p><strong>Marks:</strong> {education.marks || ""}</p>
                <p>
                  <strong>Education Documents:</strong>{" "}
                  {education.educationDocuments?.length > 0 ? (
                    education.educationDocuments
                      .filter(
                        (doc) => doc && doc !== "string" && doc.trim() !== ""
                      )
                      .map((doc, idx) => (
                        <button
                          key={idx}
                          className="document-button"
                          onClick={() =>
                            handleDownload(
                              selectedResource.resourceID,
                              "educationdocument",
                              doc
                            )
                          }
                        >
                          {doc}
                        </button>
                      ))
                  ) : (
                    <span>No documents available.</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p>No education details available.</p>
          )}
          
          {/* Job Details */}
          <h4>Job Details</h4>
          {selectedResource?.jobDetails?.length > 0 ? (
            selectedResource.jobDetails.map((job, index) => (
              <div key={index} className="section">
                <p><strong>Company:</strong> {job.company && job.company !== "string" ? job.company : "N/A"}</p>
                <p><strong>Start Date:</strong> {job.startDate ? new Date(job.startDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>End Date:</strong> {job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>Roles and Responsibilities:</strong> {job.rolesAndResponsibility && job.rolesAndResponsibility !== "string" ? job.rolesAndResponsibility : "N/A"}</p>
                <p><strong>Last Designation:</strong> {job.lastDesignation && job.lastDesignation !== "string" ? job.lastDesignation : "N/A"}</p>
                
                <p>
                  <strong>Offer Letters:</strong>{" "}
                  {job.offerLetters?.length > 0 ? (
                    job.offerLetters
                      .filter((doc) => doc && doc !== "string" && doc.trim() !== "")
                      .map((doc, idx) => (
                        <button
                          key={idx}
                          className="document-button"
                          onClick={() =>
                            handleDownload(selectedResource.resourceID, "offerletter", doc)
                          }
                        >
                          {doc}
                        </button>
                      ))
                  ) : (
                    <span>No offer letters available.</span>
                  )}
                </p>
                
                <p>
                  <strong>Relieving Letters:</strong>{" "}
                  {job.relievingLetters?.length > 0 ? (
                    job.relievingLetters
                      .filter((doc) => doc && doc !== "string" && doc.trim() !== "")
                      .map((doc, idx) => (
                        <button
                          key={idx}
                          className="document-button"
                          onClick={() =>
                            handleDownload(selectedResource.resourceID, "relievingletter", doc)
                          }
                        >
                          {doc}
                        </button>
                      ))
                  ) : (
                    <span>No relieving letters available.</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p>No job details available.</p>
          )}
          
      
          {/* Resume Uploads */}
          <h4>Resume Uploads</h4>
          <div className="section">
            <p>
              <strong>Resumes:</strong>{" "}
              {selectedResource.resumeUploads?.length > 0 ? (
                selectedResource.resumeUploads
                  .filter((doc) => doc && doc.trim() !== "") // Filter out invalid entries
                  .map((doc, idx) => (
                    <button
                      key={idx}
                      className="document-button"
                      onClick={() =>
                        handleDownload(selectedResource.resourceID, "resume", doc)
                      }
                    >
                      {doc}
                    </button>
                  ))
              ) : (
                <span>No resumes uploaded.</span>
              )}
            </p>
          </div>


          {/* Status Details */}
          <h4>Status Details</h4>
          {Array.isArray(selectedResource?.statusDetails) && selectedResource.statusDetails.length > 0 ? (
            selectedResource.statusDetails
              .filter((status) => status && typeof status === "object") // Ensure valid status objects
              .map((status, index) => (
                <div key={index} className="section">
                  {/* <p><strong>Status ID:</strong> {status.statusId || "N/A"}</p> */}
                  <p><strong>Status Name:</strong> {status.statusName && status.statusName !== "string" ? status.statusName : "N/A"}</p>
                  <p><strong>Status Type:</strong> {status.statusType && status.statusType !== "string" ? status.statusType : "N/A"}</p>
                  <p><strong>Date and Time Stamp:</strong> {status.dateTimeStamp ? new Date(status.dateTimeStamp).toLocaleString() : "N/A"}</p>
                </div>
              ))
          ) : (
            <p>No status details available.</p>
          )}

          {/* Resource Notes */}
          <h4>Resource Notes</h4>
          {Array.isArray(selectedResource?.resourceNotes) && selectedResource.resourceNotes.length > 0 ? (
            [...selectedResource.resourceNotes]
              .filter((note) => note && typeof note === "object") // Ensure valid note objects
              .sort((a, b) => new Date(b.notesTimeStamp) - new Date(a.notesTimeStamp)) // Sort by notesTimeStamp in descending order
              .map((note, index) => (
                <div key={index} className="section">
                  <p><strong>Note:</strong> {note.notes || "N/A"}</p>
                  <p><strong>Timestamp:</strong> {note.notesTimeStamp ? new Date(note.notesTimeStamp).toLocaleString() : "N/A"}</p>
                </div>
              ))
          ) : (
            <p>No resource notes available.</p>
          )}


          <h4>Travel Details</h4>
          <div className="section">
          <p><strong>Departure City:</strong> {selectedResource.departureCity !== "string" && selectedResource.departureCity !== null ? selectedResource.departureCity : ""}</p>
          <p><strong>Arrival City:</strong> {selectedResource.arrivalCity !== "string" && selectedResource.arrivalCity !== null ? selectedResource.arrivalCity : ""}</p>
          <p><strong>Departure Date:</strong> {selectedResource.departureDate ? new Date(selectedResource.departureDate).toLocaleString() : "N/A"}</p>
          <p><strong>Arrival Date:</strong> {selectedResource.arrivalDate ? new Date(selectedResource.arrivalDate).toLocaleString() : "N/A"}</p>
          </div>

        </div>
      )}



      {/* Edit Resource Form */}
      {editResource && (
        <div className="edit-resource-form">
          <h3>Edit Resource</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <p><strong>Resource ID:</strong> {editResource.ResourceID || "N/A"}</p>
          
            {/* Basic Fields */}
            <label>First Name:</label>
            <input
              type="text"
              value={editResource.FirstName || ""}
              onChange={(e) => setEditResource({ ...editResource, FirstName: e.target.value })}
            />

            <label>Last Name:</label>
            <input
              type="text"
              value={editResource.LastName || ""}
              onChange={(e) => setEditResource({ ...editResource, LastName: e.target.value })}
            />

            <label>Middle Name:</label>
            <input
              type="text"
              value={editResource.MiddleName || ""}
              onChange={(e) => setEditResource({ ...editResource, MiddleName: e.target.value })}
            />

            <label>Email ID:</label>
            <input
              type="email"
              value={editResource.EmailID || ""}
              onChange={(e) => setEditResource({ ...editResource, EmailID: e.target.value })}
            />

            <label>Experience Years:</label>
            <input
              type="number"
              value={editResource.ExperienceYears || 0}
              onChange={(e) => setEditResource({ ...editResource, ExperienceYears: parseInt(e.target.value, 10) || 0 })}
            />

            <label>Technical Skills:</label>
            <input
              type="text"
              value={(editResource.TechnicalSkills && editResource.TechnicalSkills.join(", ")) || ""}
              onChange={(e) =>
                setEditResource({
                  ...editResource,
                  TechnicalSkills: e.target.value.split(",").map((skill) => skill.trim()),
                })
              }
            />

            <label>Key Summary:</label>
            <textarea
              value={editResource.KeySummary || ""}
              onChange={(e) => setEditResource({ ...editResource, KeySummary: e.target.value })}
            />

            <label>Address (India):</label>
            <input
              type="text"
              value={editResource.CurrentIndiaAddress || ""}
              onChange={(e) => setEditResource({ ...editResource, CurrentIndiaAddress: e.target.value })}
            />

            <label>Address (US):</label>
            <input
              type="text"
              value={editResource.CurrentUSAddress || ""}
              onChange={(e) => setEditResource({ ...editResource, CurrentUSAddress: e.target.value })}
            />

            <label>Phone Number:</label>
            <input
              type="text"
              value={editResource.PhoneNumber || ""}
              onChange={(e) => setEditResource({ ...editResource, PhoneNumber: e.target.value })}
            />

            <label>Country of Origin:</label>
            <input
              type="text"
              value={editResource.CountryOfOrigin || ""}
              onChange={(e) => setEditResource({ ...editResource, CountryOfOrigin: e.target.value })}
            />

            <label>Resource Type:</label>
            <select
              value={editResource.UserType || ""}
              onChange={(e) => {
                const selectedUserType = e.target.value;
                setEditResource((prev) => ({
                  ...prev,
                  UserType: selectedUserType,
                  WorkStatus: selectedUserType === "OPT" ? prev.WorkStatus || "" : "", // Clear WorkStatus if UserType is not OPT
                  YearOfFiling: selectedUserType === "H1B" ? prev.YearOfFiling || "" : "", // Clear YearOfFiling if UserType is not H1B
                }));
              }}
            >
              <option value="">Select User Type</option>
              <option value="H1B">H1B</option>
              <option value="OPT">OPT</option>
            </select>
            
            {/* Conditionally Render Year of Filing for H1B */}
            {editResource.UserType === "H1B" && (
              <>
                <label>Year Of Filing:</label>
                <select
                  value={editResource.YearOfFiling || ""}
                  onChange={(e) =>
                    setEditResource({ ...editResource, YearOfFiling: parseInt(e.target.value, 10) || "" })
                  }
                >
                  <option value="" disabled>Select a year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </>
            )}

            {/* Conditionally Render Work Status for OPT */}
            {editResource.UserType === "OPT" && (
              <>
                <label>Work Status:</label>
                <select
                  value={editResource.WorkStatus || ""}
                  onChange={(e) => {
                    const selectedWorkStatus = e.target.value;
                    setEditResource((prev) => ({
                      ...prev,
                      WorkStatus: selectedWorkStatus,
                      StartDate: "", // Reset StartDate when WorkStatus changes
                      EndDate: "", // Reset EndDate when WorkStatus changes
                    }));
                  }}
                >
                  <option value="">Select Work Status</option>
                  <option value="OPT">OPT</option>
                  <option value="CPT">CPT</option>
                  <option value="Stem OPT">Stem OPT</option>
                  <option value="Day 1 CPT">Day 1 CPT</option>
                </select>
                
                {/* Conditionally Render Start and End Date Labels Based on Work Status */}
                {editResource.WorkStatus && (
                  <>
                    <label>
                      {editResource.WorkStatus === "OPT"
                        ? "OPT Start Date"
                        : editResource.WorkStatus === "CPT"
                        ? "CPT Start Date"
                        : editResource.WorkStatus === "Stem OPT"
                        ? "Stem OPT Start Date"
                        : "Day 1 CPT Start Date"}
                      :
                    </label>
                    <input
                      type="date"
                      value={editResource.StartDate ? editResource.StartDate.split("T")[0] : ""}
                      onChange={(e) =>
                        setEditResource((prev) => ({ ...prev, StartDate: e.target.value }))
                      }
                    />

                    <label>
                      {editResource.WorkStatus === "OPT"
                        ? "OPT End Date"
                        : editResource.WorkStatus === "CPT"
                        ? "CPT End Date"
                        : editResource.WorkStatus === "Stem OPT"
                        ? "Stem OPT End Date"
                        : "Day 1 CPT End Date"}
                      :
                    </label>
                    <input
                      type="date"
                      value={editResource.EndDate ? editResource.EndDate.split("T")[0] : ""}
                      onChange={(e) =>
                        setEditResource((prev) => ({ ...prev, EndDate: e.target.value }))
                      }
                    />
                  </>
                )}
              </>
            )}

            <label>Referred By:</label>
            <input
              type="text"
              value={editResource.ReferredBy || ""}
              onChange={(e) => setEditResource({ ...editResource, ReferredBy: e.target.value })}
            />


            <label>Joining Date:</label>
            <input
              type="date"
              value={editResource.JoiningDate ? editResource.JoiningDate.split("T")[0] : ""}
              onChange={(e) => setEditResource({ ...editResource, JoiningDate: e.target.value })}
            />

            <label>Exit Date:</label>
            <input
              type="date"
              value={editResource.ExitDate ? editResource.ExitDate.split("T")[0] : ""}
              onChange={(e) => setEditResource({ ...editResource, ExitDate: e.target.value })}
            />

            {/* Education Details */}
            <h4>Education Details</h4>
            {console.log("Education Details:", editResource.EducationDetails)}
            {(Array.isArray(editResource.EducationDetails) ? editResource.EducationDetails : []).map((education, index) => (
              <div key={index} style={{ marginBottom: "20px" }} className="education-section">
                <label>Graduation Year:</label>
                <input
                  type="number"
                  value={education.graduationYear ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      graduationYear: parseInt(e.target.value, 10) || 0,
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <label>Institution Name:</label>
                <input
                  type="text"
                  value={education.institutionName ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      institutionName: e.target.value || "",
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <label>GPA:</label>
                <input
                  type="number"
                  value={education.gpa ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      gpa: parseFloat(e.target.value) || 0,
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <label>Percentage:</label>
                <input
                  type="number"
                  value={education.percentage ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      percentage: parseFloat(e.target.value) || 0,
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <label>Grade:</label>
                <input
                  type="text"
                  value={education.grade ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      grade: e.target.value || "",
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <label>Marks:</label>
                <input
                  type="number"
                  value={education.marks ?? ""}
                  onChange={(e) => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation[index] = {
                      ...updatedEducation[index],
                      marks: parseInt(e.target.value, 10) || 0,
                    };
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const updatedEducation = [...editResource.EducationDetails];
                    updatedEducation.splice(index, 1); // Remove the current entry
                    setEditResource({ ...editResource, EducationDetails: updatedEducation });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-more-button"
              onClick={() => {
                const updatedEducation = [
                  ...(editResource.EducationDetails || []),
                  {
                    graduationYear: 0,
                    institutionName: "",
                    gpa: 0,
                    percentage: 0,
                    grade: "",
                    marks: 0,
                  },
                ];
                setEditResource({ ...editResource, EducationDetails: updatedEducation });
              }}
            >
              Add More Education
            </button>
            
            
            {/* Job Details */}
            <h4>Job Details</h4>
            {console.log("Job Details:", editResource.JobDetails)}
            {(Array.isArray(editResource.JobDetails) ? editResource.JobDetails : []).map((job, index) => (
              <div key={index} style={{ marginBottom: "20px" }} className="job-details-section">
                <label>Company:</label>
                <input
                  type="text"
                  value={job.Company ?? ""}
                  onChange={(e) => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs[index] = { ...updatedJobs[index], Company: e.target.value || "" };
                    setEditResource({ ...editResource, JobDetails: updatedJobs });
                  }}
                />

                <label>Start Date:</label>
                <input
                  type="date"
                  value={job.StartDate ? job.StartDate.split("T")[0] : ""}
                  onChange={(e) => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs[index] = { ...updatedJobs[index], StartDate: e.target.value || "" };
                    setEditResource({ ...editResource, JobDetails: updatedJobs });
                  }}
                />

                <label>End Date:</label>
                <input
                  type="date"
                  value={job.EndDate ? job.EndDate.split("T")[0] : ""}
                  onChange={(e) => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs[index] = { ...updatedJobs[index], EndDate: e.target.value || "" };
                    setEditResource({ ...editResource, JobDetails: updatedJobs });
                  }}
                />

                <label>Roles and Responsibility:</label>
                <textarea
                  value={job.RolesAndResponsibility ?? ""}
                  onChange={(e) => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs[index] = { ...updatedJobs[index], RolesAndResponsibility: e.target.value || "" };
                    setEditResource({ ...editResource, JobDetails: updatedJobs });//k
                  }}
                />

                <label>Last Designation:</label>
                <input
                  type="text"
                  value={job.LastDesignation ?? ""}
                  onChange={(e) => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs[index] = { ...updatedJobs[index], LastDesignation: e.target.value || "" };
                    setEditResource({ ...editResource, JobDetails: updatedJobs });
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const updatedJobs = [...editResource.JobDetails];
                    updatedJobs.splice(index, 1); // Remove the current entry
                    setEditResource({ ...editResource, JobDetails: updatedJobs });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-more-button"
              onClick={() => {
                const updatedJobs = [
                  ...(editResource.JobDetails || []),
                  {
                    Company: "",
                    StartDate: "",
                    EndDate: "",
                    RolesAndResponsibility: "",
                    LastDesignation: "",
                    OfferLetters: [],
                    RelievingLetters: [],
                  },
                ];
                setEditResource({ ...editResource, JobDetails: updatedJobs });
              }}
            >
              Add More Job Details
            </button>
            
            <h4>Travel Details</h4>
            <div className="">
            <label>Departure City:</label>
                  <input
                    type="text"
                    value={editResource.DepartureCity || ""}
                    onChange={(e) => setEditResource({ ...editResource, DepartureCity: e.target.value })}
                  />
            <label>Arrival City:</label>
                  <input
                    type="text"
                    value={editResource.ArrivalCity || ""}
                    onChange={(e) => setEditResource({ ...editResource, ArrivalCity: e.target.value })}
                  />
            <label>Departure Date:</label>
                  <input
                    type="date"
                    value={editResource.DepartureDate ? editResource.DepartureDate.split("T")[0] : ""}
                    onChange={(e) => setEditResource({ ...editResource, DepartureDate: e.target.value })}
                  />
            <label>Arrival Date:</label>
                  <input
                    type="date"
                    value={editResource.ArrivalDate ? editResource.ArrivalDate.split("T")[0] : ""}
                    onChange={(e) => setEditResource({ ...editResource, ArrivalDate: e.target.value })}
                  />
            </div>
            
                  {/* Actions */}
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setEditResource(null)}>Cancel</button>
                </form>
              </div>
            )}


            {/* Change Status Form */}
            {selectedStatus && (
              <div className="change-status-form">
                <h3>Change Status</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleStatusChange();
                  }}
                >
                  <p><strong>Resource ID:</strong> {selectedStatus.resourceID}</p>
                  <label>Status:</label>
                  <select
                    value={selectedStatus.statusId}
                    onChange={(e) => {
                      const selectedOption = statusOptions.find(
                        (status) => status.StatusId === parseInt(e.target.value, 10)
                      );
                      setSelectedStatus({
                        ...selectedStatus,
                        statusId: selectedOption?.StatusId || "",
                        statusName: selectedOption?.StatusName || "",
                        statusType: selectedOption?.StatusType || "",
                      });
                    }}
                  >
                    <option value="" disabled>Select a Status</option>
                    {statusOptions.map((status) => (
                      <option key={status.StatusId} value={status.StatusId}>
                        {status.StatusName}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Update Status</button>
                  <button type="button" onClick={() => setSelectedStatus(null)}>Cancel</button>
                </form>
              </div>
            )}



            {/* Update Notes Form */}
            {selectedNotes && (
              <div className="change-status-form">
                <h3>Update Notes</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNotesChange();
                  }}
                >
                  <p><strong>Resource ID:</strong> {selectedNotes.resourceID}</p>
                  <label>Notes:</label>
                  <textarea
                    value={selectedNotes.notes}
                    onChange={(e) =>
                      setSelectedNotes({ ...selectedNotes, notes: e.target.value })
                    }
                    rows="4"
                    cols="50"
                  />
                  <button type="submit">Update Notes</button>
                  <button type="button" onClick={() => setSelectedNotes(null)}>Cancel</button>
                </form>
              </div>
            )}


          </div>
        );
  };
export default Resources;
