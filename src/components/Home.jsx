import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

// Register components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = ({ userType }) => {
  const [statusData, setStatusData] = useState([]);
  const [yearOfFiling, setYearOfFiling] = useState(2025); // Default year
  const [statusOptions, setStatusOptions] = useState([]); // Dynamic status options
  const navigate = useNavigate();

  // H1B Status Options
  const H1BStatusOptions = [
    { StatusId: 1, StatusName: "Application Submitted", StatusType: "h1b" },
    { StatusId: 2, StatusName: "Application Selected", StatusType: "h1b" },
    { StatusId: 3, StatusName: "Application Not Selected", StatusType: "h1b" },
    { StatusId: 4, StatusName: "Ready for Screening", StatusType: "h1b" },
    { StatusId: 5, StatusName: "Screening Scheduled", StatusType: "h1b" },
    { StatusId: 6, StatusName: "Screening Completed", StatusType: "h1b" },
    { StatusId: 7, StatusName: "Resource Selected", StatusType: "h1b" },
    { StatusId: 8, StatusName: "Resource Not Selected", StatusType: "h1b" },
    { StatusId: 9, StatusName: "Yet to Submit H1B Application to USCIS", StatusType: "h1b" },
    { StatusId: 10, StatusName: "H1B Application Submitted to USCIS", StatusType: "h1b" },
    { StatusId: 11, StatusName: "Picked in Lottery", StatusType: "h1b" },
    { StatusId: 12, StatusName: "Not Picked in Lottery", StatusType: "h1b" },
    { StatusId: 13, StatusName: "Yet to Roll Offer to Resource", StatusType: "h1b" },
    { StatusId: 14, StatusName: "Rolled Offer Letter to Resource", StatusType: "h1b" },
    { StatusId: 15, StatusName: "H1B Application Filed", StatusType: "h1b" },
    { StatusId: 16, StatusName: "H1B Application Not Filed", StatusType: "h1b" },
    { StatusId: 17, StatusName: "Stamping Documents Provided", StatusType: "h1b" },
    { StatusId: 18, StatusName: "Stamping Documents Not Provided", StatusType: "h1b" },
    { StatusId: 19, StatusName: "Ready for Stamping", StatusType: "h1b" },
    { StatusId: 20, StatusName: "Visa Interview Scheduled", StatusType: "h1b" },
    { StatusId: 21, StatusName: "H1B Approved", StatusType: "h1b" },
    { StatusId: 22, StatusName: "H1B Rejected", StatusType: "h1b" },
    { StatusId: 23, StatusName: "H1B RFE", StatusType: "h1b" },
    { StatusId: 24, StatusName: "Ready to Move to US", StatusType: "h1b" },
    { StatusId: 25, StatusName: "Traveling", StatusType: "h1b" },
    { StatusId: 26, StatusName: "Moved to US", StatusType: "h1b" },
    { StatusId: 27, StatusName: "Yet to Map to Project", StatusType: "h1b" },
    { StatusId: 28, StatusName: "Mapped to Project", StatusType: "h1b" },
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

  // Set the status options dynamically based on the userType
  useEffect(() => {
    if (userType === "H1B") {
      setStatusOptions(H1BStatusOptions);
    } else if (userType === "OPT") {
      setStatusOptions(OPTStatusOptions);
    } else {
      setStatusOptions([]);
    }
  }, [userType]);

  const fetchStatusData = async () => {
    if (statusOptions.length === 0) return; // Wait until statusOptions is updated
    try {
      const promises = statusOptions.map((status) =>
        axios
          .get(`https://localhost:7078/api/Resource/status/${status.StatusId}/${userType}/${yearOfFiling}`)
          .then((res) => ({
            statusId: status.StatusId,
            statusName: status.StatusName, // Use StatusName from options
            count: res.data.length, // Assuming API returns an array of resources
          }))
          .catch(() => null) // Handle API errors gracefully
      );

      const results = await Promise.all(promises);

      // Filter out null or empty results
      const filteredData = results.filter((res) => res && res.count > 0);

      setStatusData(filteredData);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, [statusOptions, yearOfFiling]); // Re-fetch data when userType, yearOfFiling, or statusOptions change

  const chartData = {
    labels: statusData.map((item) => item.statusName), // Use statusName for labels
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const handlePieClick = (event, elements) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const statusId = statusData[index].statusId;
      navigate(`/resources?statusId=${statusId}&userType=${userType}&yearOfFiling=${yearOfFiling}`);
    }
  };

  return (
    <div className="home-container">
      <h1>Dashboard</h1>
      <div className="top-controls">
        <label htmlFor="yearOfFiling" className="year-label">Year of Filing:</label>
        <select
          id="yearOfFiling"
          value={yearOfFiling}
          onChange={(e) => setYearOfFiling(parseInt(e.target.value, 10))}
          className="year-dropdown"
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>
      {statusData.length > 0 ? (
        <div className="pie-chart-container">
          <Pie
            data={chartData}
            options={{
              onClick: handlePieClick,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="no-data-message">No data available to display.</div>
      )}
    </div>
  );
};

export default Home;
