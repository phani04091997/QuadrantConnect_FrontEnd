import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Status.css";

const Status = ({ userType: defaultUserType }) => {
  const [searchParams, setSearchParams] = useState({ firstName: "", lastName: "", skill: "" });
  const [resources, setResources] = useState([]);
  const [pipeline, setPipeline] = useState(null);
  const [userType, setUserType] = useState(defaultUserType); // Set navbar `userType` as default

  // Fetch resources using search API with userType
  const fetchResources = async (currentUserType = userType) => {
    try {
      setResources([]);
      const response = await axios.get("https://localhost:7078/api/Resource/search", {
        params: { ...searchParams, userType: currentUserType },
      });
      setResources(response.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  // Fetch status pipeline for a resource with userType
  const fetchPipeline = async (resourceId) => {
    try {
      const response = await axios.get(`https://localhost:7078/api/Resource/${resourceId}/status`, {
        params: { userType },
      });
      setPipeline(response.data || []);
    } catch (error) {
      console.error("Error fetching status pipeline:", error);
      alert("Failed to fetch status pipeline.");
    }
  };

  // Load resources when the component mounts or when userType/searchParams changes
  useEffect(() => {
    fetchResources();
  }, [userType, searchParams]);

  // Update userType when it changes from the parent
  useEffect(() => {
    setUserType(defaultUserType); // Update local state
    fetchResources(defaultUserType); // Fetch resources for the updated userType
  }, [defaultUserType]);

  return (
    <div className="status-pipeline-container">
      <h2>Status Pipeline</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by First Name"
          value={searchParams.firstName}
          onChange={(e) => setSearchParams({ ...searchParams, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Last Name"
          value={searchParams.lastName}
          onChange={(e) => setSearchParams({ ...searchParams, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Skill"
          value={searchParams.skill}
          onChange={(e) => setSearchParams({ ...searchParams, skill: e.target.value })}
        />
        <button onClick={() => fetchResources(userType)}>Search</button>
      </div>

      {/* Resources Table */}
      <table>
        <thead>
          <tr>
            <th>Resource ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan="4">No resources found</td>
            </tr>
          ) : (
            resources.map((resource) => (
              <tr key={resource.resourceID}>
                <td>{resource.resourceID}</td>
                <td>{resource.firstName}</td>
                <td>{resource.lastName}</td>
                <td>
                  <button onClick={() => fetchPipeline(resource.resourceID)}>Status Pipeline</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Status Pipeline Display */}
      {pipeline && (
        <div className="pipeline-display">
          <h3>Pipeline for Resource</h3>
          <div className="pipeline">
            {pipeline.map((status, index) => (
              <span key={index}>
                <strong>{status.statusName}</strong> <br />
                <small>{new Date(status.dateTimeStamp).toLocaleString()}</small>
                {index < pipeline.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
