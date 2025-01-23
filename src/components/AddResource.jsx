import React, { useState } from "react";
import axios from "axios";
import "../css/AddResource.css";
import SkillsInput from "./SkillsInput";

const AddResource = () => {
  const defaultResourceData = {
    Id: "string",
    ResourceID: 0,
    FirstName: "string",
    LastName: "string",
    MiddleName: "string",
    EmailID: "string",
    ExperienceYears: 0,
    TechnicalSkills: ["string"],
    KeySummary: "string",
    CurrentIndiaAddress: "string",
    CurrentUSAddress: "string",
    PhoneNumber: "string",
    CountryOfOrigin: "string",
    UserType: "string",
    WorkStatus: "string",
    YearOfFiling: 0,
    EducationDetails: [
      {
        EducationID: 0,
        GraduationYear: 0,
        InstitutionName: "string",
        GPA: 0,
        Percentage: 0,
        Grade: "string",
        Marks: 0,
        EducationDocuments: ["string"],
      },
    ],
    JobDetails: [
      {
        Company: "string",
        StartDate: new Date().toISOString(),
        EndDate: new Date().toISOString(),
        RolesAndResponsibility: "string",
        LastDesignation: "string",
        OfferLetters: ["string"],
        RelievingLetters: ["string"],
      },
    ],
    StatusDetails: [],
    DepartureCity: "string",
    ArrivalCity: "string",
    DepartureDate: new Date().toISOString(),
    ArrivalDate: new Date().toISOString(),
  };

  const [resourceData, setResourceData] = useState({
    Id: "",
    ResourceID: "",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    EmailID: "",
    ExperienceYears: "",
    TechnicalSkills: [],
    KeySummary: "",
    CurrentIndiaAddress: "",
    CurrentUSAddress: "",
    PhoneNumber: "",
    CountryOfOrigin: "",
    UserType: "",
    WorkStatus: "",
    YearOfFiling: "",
    EducationDetails: [
      {
        EducationID: "",
        GraduationYear: "",
        InstitutionName: "",
        GPA: "",
        Percentage: "",
        Grade: "",
        Marks: "",
        EducationDocuments: [],
      },
    ],
    JobDetails: [
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
    StatusDetails: [
      {
        StatusId: 1,
        StatusName: "Application Submitted",
        StatusType: "h1b",
        DateTimeStamp: new Date().toISOString(),
      },
    ],
    DepartureCity: "string",
    ArrivalCity: "string",
    DepartureDate: new Date().toISOString(),
    ArrivalDate: new Date().toISOString(),
  });

  const [fileUploads, setFileUploads] = useState({
    resumeUploads: null,
    educationDocuments: null,
    offerLetters: null,
    relievingLetters: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setResourceData((prev) => {
      let updatedStatusDetails = prev.StatusDetails;

      // Update StatusDetails dynamically when UserType changes
      if (name === "UserType") {
        updatedStatusDetails =
          value === "H1B"
            ? [
                {
                  StatusId: 1,
                  StatusName: "Application Submitted",
                  StatusType: "h1b",
                  DateTimeStamp: new Date().toISOString(),
                },
              ]
            : value === "OPT"
            ? [
                {
                  StatusId: 29,
                  StatusName: "Application Submitted",
                  StatusType: "opt",
                  DateTimeStamp: new Date().toISOString(),
                },
              ]
            : []; // Default to empty array for invalid UserType
      }

      return {
        ...prev,
        [name]: value,
        StatusDetails: updatedStatusDetails,
      };
    });
  };


  const handleNestedInputChange = (e, section, index, field) => {
    const { value } = e.target;
    setResourceData((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection[index][field] = value;
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleAddEntry = (section, defaultEntry) => {
    setResourceData((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...defaultEntry }],
    }));
  };

  const handleRemoveEntry = (section, index) => {
    setResourceData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to an array
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] ? [...prev[fieldName], ...newFiles] : newFiles, // Merge new files with existing ones
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const finalResourceData = {
        ...defaultResourceData,
        ...Object.keys(resourceData).reduce((result, key) => {
          if (Array.isArray(resourceData[key])) {
            // Handle arrays
            result[key] = resourceData[key].length
              ? resourceData[key].map((item) =>
                  typeof item === "string"
                    ? item // For TechnicalSkills
                    : { ...defaultResourceData[key][0], ...item,
                      Marks: item.Marks || 0,
                      Grade: item.Grade || "",
                      Percentage: item.Percentage || 0,
                    } // For objects like EducationDetails, JobDetails
                )
              : [...defaultResourceData[key]]; // Use default array if empty
          } else {
            // Replace empty values with default values
            result[key] = resourceData[key] !== "" ? resourceData[key] : defaultResourceData[key];
          }
          return result;
        }, {}),
      };
  
      console.log("Final Resource Data to Submit:", finalResourceData);
  
      await axios.post("https://localhost:7078/api/Resource/create-resource", finalResourceData, {
        headers: { "Content-Type": "application/json" },
      });

      // Step 2: Fetch the latest resourceId using the GET API
    const getResourceResponse = await axios.get(
      "https://localhost:7078/api/Resource/latest-resource-id",
      { headers: { "Content-Type": "application/json" } }
    );
    const resourceId = getResourceResponse.data; // Assume the API returns the latest resourceId directly

      const formData = new FormData();
      if (fileUploads.resumeUploads) {
        Array.from(fileUploads.resumeUploads).forEach((file) => {
          formData.append("resumeUploads", file);
        });
      }
      if (fileUploads.educationDocuments) {
        Array.from(fileUploads.educationDocuments).forEach((file) => {
          formData.append("educationDocuments", file);
        });
      }
      if (fileUploads.offerLetters) {
        Array.from(fileUploads.offerLetters).forEach((file) => {
          formData.append("offerLetters", file);
        });
      }
      if (fileUploads.relievingLetters) {
        Array.from(fileUploads.relievingLetters).forEach((file) => {
          formData.append("relievingLetters", file);
        });
      }

      await axios.post(
        `https://localhost:7078/api/Resource/upload-files/${resourceId}`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Resource created and files uploaded successfully!");
    } catch (error) {
      console.error("Submission failed:", error.response?.data || error.message);
      alert("Submission failed!");
    }
  };

  return (
  <div className="content-container">
  <div className="add-resource-form">
    <h2>Add Resource</h2>
    <form onSubmit={handleSubmit}>
      {/* Basic Fields */}
      <label>
      First Name: <span className="required">*</span>
      </label>
      <input type="text" name="FirstName" value={resourceData.FirstName} onChange={handleInputChange} required/>

      <label>
      Last Name: <span className="required">*</span>
      </label>
      <input type="text" name="LastName" value={resourceData.LastName} onChange={handleInputChange} required/>

      <label>Middle Name:</label>
      <input type="text" name="MiddleName" value={resourceData.MiddleName} onChange={handleInputChange} />

      <label>
      Email ID: <span className="required">*</span>
      </label>
      <input type="email" name="EmailID" value={resourceData.EmailID} onChange={handleInputChange} required/>

      <label>
      Experience Years: <span className="required">*</span>
      </label>
      <input type="number" name="ExperienceYears" value={resourceData.ExperienceYears} onChange={handleInputChange} step="0.01" required/>

      <label>
      Technical Skills: <span className="required">*</span>
      </label>
      <SkillsInput 
        skills={resourceData.TechnicalSkills}
        setSkills={(updatedSkills) =>
          setResourceData((prev) => ({ ...prev, TechnicalSkills: updatedSkills }))
        }
      />

      <label>Key Summary:</label>
      <textarea name="KeySummary" value={resourceData.KeySummary} onChange={handleInputChange} />

      <label>Current India Address:</label>
      <textarea name="CurrentIndiaAddress" value={resourceData.CurrentIndiaAddress} onChange={handleInputChange} />

      <label>Current US Address:</label>
      <textarea name="CurrentUSAddress" value={resourceData.CurrentUSAddress} onChange={handleInputChange} />

      <label>Phone Number:</label>
      <input type="text" name="PhoneNumber" value={resourceData.PhoneNumber} onChange={handleInputChange} />

      <label>Country of Origin:</label>
      <input type="text" name="CountryOfOrigin" value={resourceData.CountryOfOrigin} onChange={handleInputChange} />

      <label>
      Resource Type: <span className="required">*</span>
      </label>
      <select
        name="UserType"
        value={resourceData.UserType}
        onChange={(e) => {
          handleInputChange(e);
          if (e.target.value === "H1B") {
            setResourceData((prev) => ({ ...prev, WorkStatus: "" })); // Clear WorkStatus if H1B is selected
          }
        }}
        required
      >
        <option value="">Select Resource Type</option> {/* Placeholder option */}
        <option value="H1B">H1B</option>
        <option value="OPT">OPT</option>
      </select>
      
      {/* Conditionally Render WorkStatus Dropdown */}
      {resourceData.UserType === "OPT" && (
        <>
          <label>
            Work Status: <span className="required">*</span>
          </label>
          <select
            name="WorkStatus"
            value={resourceData.WorkStatus || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Work Status</option> {/* Placeholder option */}
            <option value="OPT">OPT</option>
            <option value="CPT">CPT</option>
            <option value="Stem OPT">Stem OPT</option>
            <option value="Day 1 CPT">Day 1 CPT</option>
          </select>
        </>
      )}


      <label>
      Year Of Filing: <span className="required">*</span>
      </label>
      <select
        name="YearOfFiling"
        value={resourceData.YearOfFiling}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Year</option> {/* Placeholder option */}
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>

      {/* Education Details */}
      <h3>Education Details</h3>
      {resourceData.EducationDetails.map((education, index) => (
        <div key={index} className="education-section">
          <label>
          Level of Education: <span className="required">*</span>
          </label>
          <select
            value={education.LevelOfEducation || ""}
            onChange={(e) => {
              const level = e.target.value;
              handleNestedInputChange(e, "EducationDetails", index, "LevelOfEducation");
              setResourceData((prev) => {
                const updatedSection = [...prev.EducationDetails];
                updatedSection[index].EducationID = level === "Masters" ? 1 : level === "Bachelors" ? 2 : 0;
                return { ...prev, EducationDetails: updatedSection };
              });
            }}
          required>
            <option value="">Select Level</option>
            <option value="Masters">Masters</option>
            <option value="Bachelors">Bachelors</option>
          </select>
          
          <label>
          Institution Name: <span className="required">*</span>
          </label>
          <input
            type="text"
            value={education.InstitutionName}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "InstitutionName")}
          required/>

          <label>
          Graduation Year: <span className="required">*</span>
          </label>
          <input
            type="number"
            value={education.GraduationYear}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "GraduationYear")}
          required/>

          <label>
          GPA: <span className="required">*</span>
          </label>
          <input
            type="number"
            value={education.GPA}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "GPA")}
          required/>

          <label>
          Percentage: 
          </label>
          <input
            type="number"
            value={education.Percentage}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "Percentage")}
          />

          <label>
          Grade: 
          </label>
          <input
            type="text"
            value={education.Grade}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "Grade")}
          />

          <label>
          Marks: 
          </label>
          <input
            type="number"
            value={education.Marks}
            onChange={(e) => handleNestedInputChange(e, "EducationDetails", index, "Marks")}
          />
          <button type="button" onClick={() => handleRemoveEntry("EducationDetails", index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          handleAddEntry("EducationDetails", {
            EducationID: 0,
            GraduationYear: 0,
            InstitutionName: "",
            GPA: 0,
            Percentage: 0,
            Grade: "",
            Marks: 0,
            LevelOfEducation: "",
            EducationDocuments: [],
          })
        }
      >
        Add More Education
      </button>


      {/* Job Details */}
      <h3>Job Details</h3>
      {resourceData.JobDetails.map((job, index) => (
        <div key={index} className="job-details-section">
          <label>
          Company: <span className="required">*</span>
          </label>
          <input
            type="text"
            value={job.Company}
            onChange={(e) => handleNestedInputChange(e, "JobDetails", index, "Company")}
          required/>
          <label>
          Start Date: <span className="required">*</span>
          </label>
          <input
            type="date"
            value={job.StartDate}
            onChange={(e) => handleNestedInputChange(e, "JobDetails", index, "StartDate")}
          required/>
          <label>
          End Date: <span className="required">*</span>
          </label>
          <input
            type="date"
            value={job.EndDate}
            onChange={(e) => handleNestedInputChange(e, "JobDetails", index, "EndDate")}
          required/>
          <label>
          Roles and Responsibility: <span className="required">*</span>
          </label>
          <textarea
            value={job.RolesAndResponsibility}
            onChange={(e) => handleNestedInputChange(e, "JobDetails", index, "RolesAndResponsibility")}
          required/>
          <label>
          Last Designation: <span className="required">*</span>
          </label>
          <input
            type="text"
            value={job.LastDesignation}
            onChange={(e) => handleNestedInputChange(e, "JobDetails", index, "LastDesignation")}
          required/>
          <button type="button" onClick={() => handleRemoveEntry("JobDetails", index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          handleAddEntry("JobDetails", {
            Company: "",
            StartDate: "",
            EndDate: "",
            RolesAndResponsibility: "",
            LastDesignation: "",
            OfferLetters: [],
            RelievingLetters: [],
          })
        }
      >
        Add More Job Details
      </button>

      <h3>Uploads</h3>
      <div>
        {/* Resume Uploads */}
        <label>Resume Uploads:</label>
        <input
          type="file"
          name="resumeUploads"
          multiple
          onChange={(e) => handleFileChange(e, "resumeUploads")}
        />
        {fileUploads.resumeUploads?.length > 0 && (
          <ul>
            {fileUploads.resumeUploads.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        {/* Education Documents */}
        <label>Education Documents:</label>
        <input
          type="file"
          name="educationDocuments"
          multiple
          onChange={(e) => handleFileChange(e, "educationDocuments")}
        />
        {fileUploads.educationDocuments?.length > 0 && (
          <ul>
            {fileUploads.educationDocuments.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        {/* Offer Letters */}
        <label>Offer Letters:</label>
        <input
          type="file"
          name="offerLetters"
          multiple
          onChange={(e) => handleFileChange(e, "offerLetters")}
        />
        {fileUploads.offerLetters?.length > 0 && (
          <ul>
            {fileUploads.offerLetters.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        {/* Relieving Letters */}
        <label>Relieving Letters:</label>
        <input
          type="file"
          name="relievingLetters"
          multiple
          onChange={(e) => handleFileChange(e, "relievingLetters")}
        />
        {fileUploads.relievingLetters?.length > 0 && (
          <ul>
            {fileUploads.relievingLetters.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>



      
      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  </div>
</div>


  );
};

export default AddResource;
