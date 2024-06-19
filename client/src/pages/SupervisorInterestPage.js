import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/supervisorInterestPage.css";

const SupervisorInterestPage = () => {
  const [data, setData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [interests, setInterests] = useState({});
  const [reasons, setReasons] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const options = [
    "Want to supervise",
    "Agreeable",
    "Conflict of interest",
    "Do not want to supervise",
  ];

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/student/aggregate`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const result = await response.json();
        if (response.ok) {
          // console.log("Aggregated Data:", result); // Add console log to see fetched data
          setData(result);
          const uniqueFaculties = [
            ...new Set(result.map((item) => item.faculty)),
          ];
          setFaculties(uniqueFaculties);
          if (uniqueFaculties.length > 0) {
            const initialFaculty = uniqueFaculties[0];
            setSelectedFaculty(initialFaculty);
            const relevantData = result.filter(
              (item) => item.faculty === initialFaculty
            );
            const uniqueCompanies = [
              ...new Set(relevantData.map((item) => item.company)),
            ];
            setCompanies(uniqueCompanies.sort());
            setJobTitles(
              [...new Set(relevantData.flatMap((item) => item.jobTitle))].sort()
            );
          }
        } else {
          throw new Error(result.message || "Error fetching data");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
      }
    };

    const fetchInterests = async () => {
      if (!user?._id) return; // Ensure user ID is available
      try {
        const response = await fetch(
          `${apiUrl}/api/supervisorInterest/bySupervisor/${user._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const interestsData = await response.json();
        if (response.ok) {
          const newInterests = {};
          const newReasons = {};
          interestsData.forEach((interest) => {
            const key = `${interest.company}_${interest.jobTitle}`;
            newInterests[key] = interest.interest;
            newReasons[key] = interest.reason;
          });
          setInterests(newInterests);
          setReasons(newReasons);
        } else {
          throw new Error(interestsData.error);
        }
      } catch (error) {
        console.error("Failed to fetch interests:", error.message);
      }
    };

    fetchData(); // Fetch other necessary data first
    fetchInterests(); // Then fetch interests
  }, [apiUrl, user.token, user._id]); // React to changes in any of these dependencies

  useEffect(() => {
    if (selectedFaculty) {
      const relevantData = data.filter(
        (item) => item.faculty === selectedFaculty
      );
      const uniqueCompanies = [
        ...new Set(relevantData.map((item) => item.company)),
      ];
      setCompanies(uniqueCompanies.sort());
      setJobTitles(
        [...new Set(relevantData.flatMap((item) => item.jobTitle))].sort()
      );
      setSelectedCompany("");
      setSelectedJobTitle("");
    } else {
      setCompanies([]);
      setSelectedCompany("");
      setJobTitles([]);
      setSelectedJobTitle("");
    }
  }, [selectedFaculty, data]);

  useEffect(() => {
    if (selectedCompany) {
      const relevantData = data.filter(
        (item) =>
          item.faculty === selectedFaculty && item.company === selectedCompany
      );
      const uniqueJobTitles = [
        ...new Set(relevantData.flatMap((item) => item.jobTitle)),
      ];
      setJobTitles(uniqueJobTitles.sort());
      setSelectedJobTitle("");
    }
  }, [selectedCompany, selectedFaculty, data]);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    const relevantData = data.filter((item) => item.faculty === faculty);
    const uniqueCompanies = [
      ...new Set(relevantData.map((item) => item.company)),
    ];
    setCompanies(uniqueCompanies.sort());
    setJobTitles(
      [...new Set(relevantData.flatMap((item) => item.jobTitle))].sort()
    );
    setSelectedCompany("");
    setSelectedJobTitle("");
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleJobTitleChange = (e) => {
    setSelectedJobTitle(e.target.value);
  };

  const handleInterestChange = (itemKey, value) => {
    setInterests((prev) => ({ ...prev, [itemKey]: value }));
    setHasChanges(true);
    if (value === "Agreeable") {
      setReasons((prev) => {
        const updated = { ...prev };
        delete updated[itemKey];
        return updated;
      });
    }
  };

  const handleReasonChange = (itemKey, reason) => {
    setReasons((prev) => ({ ...prev, [itemKey]: reason }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    console.log("Save button clicked");

    try {
      const supervisorId = user ? user._id : null;
      console.log("Supervisor ID:", supervisorId);

      if (!supervisorId) {
        console.error("No supervisor ID found.");
        return;
      }

      const payload = Object.entries(interests).map(([key, value]) => {
        const [company, jobTitle] = key.split("_");
        return {
          supervisor: supervisorId,
          company: company,
          jobTitle: jobTitle,
          interest: value,
          reason: reasons[key] || "",
        };
      });

      console.log("Payload to save:", payload);

      const response = await fetch(`${apiUrl}/api/supervisorInterest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        console.log("Interest saved successfully!");
        setHasChanges(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to save interest", errorData);
      }
    } catch (err) {
      console.error("Error saving interest:", err);
    }
  };

  // Flatten and group data by company and job title
  const filteredData = data
    .filter(
      (item) =>
        (!selectedFaculty || item.faculty === selectedFaculty) &&
        (!selectedCompany || item.company === selectedCompany) &&
        (!selectedJobTitle || item.jobTitle.includes(selectedJobTitle))
    )
    .map((item) => ({
      company: item.company,
      jobTitle: item.jobTitle,
      jobScope: item.jobScope,
      count: item.students.length,
      faculty: item.faculty,
    }));

  // Sort data by company and job title
  const sortedData = filteredData.sort((a, b) => {
    if (a.company < b.company) return -1;
    if (a.company > b.company) return 1;
    if (a.jobTitle < b.jobTitle) return -1;
    if (a.jobTitle > b.jobTitle) return 1;
    return 0;
  });

  const groupedData = sortedData.reduce((acc, item) => {
    if (!acc[item.company]) {
      acc[item.company] = {};
    }
    if (!acc[item.company][item.jobTitle]) {
      acc[item.company][item.jobTitle] = [];
    }
    acc[item.company][item.jobTitle].push(item);
    return acc;
  }, {});

  const toggleExpandRow = (itemKey) => {
    setExpandedRows((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="supervisor-interest-container">
      <h1>Supervisor Interest</h1>
      <div className="faculty-buttons">
        {faculties.map((faculty) => (
          <button
            key={faculty}
            className={
              selectedFaculty === faculty
                ? "faculty-button active"
                : "faculty-button"
            }
            onClick={() => handleFacultySelect(faculty)}
          >
            {faculty}
          </button>
        ))}
      </div>
      <div className="filters">
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">All Companies</option>
          {companies.map((company, idx) => (
            <option key={idx} value={company}>
              {company}
            </option>
          ))}
        </select>
        <select value={selectedJobTitle} onChange={handleJobTitleChange}>
          <option value="">All Job Titles</option>
          {jobTitles.map((jobTitle, idx) => (
            <option key={idx} value={jobTitle}>
              {jobTitle}
            </option>
          ))}
        </select>
      </div>
      <table className="table-style">
        <thead>
          <tr>
            <th className="company">Company</th>
            <th className="jobTitle">Job Title</th>
            <th>Job Scope</th>
            <th>Pax</th>
            <th className="interest">Interest</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((company) => (
            <React.Fragment key={company}>
              {Object.keys(groupedData[company]).map((jobTitle, idx) => {
                const item = groupedData[company][jobTitle][0];
                const itemKey = `${item.company}_${item.jobTitle}`;
                const selectedInterest = interests[itemKey] || "Agreeable";
                const reason = reasons[itemKey] || ""; // Default to empty if not set
                const isExpanded = expandedRows[itemKey];

                return (
                  <React.Fragment key={idx}>
                    <tr>
                      {idx === 0 && (
                        <td rowSpan={Object.keys(groupedData[company]).length}>
                          {item.company}
                        </td>
                      )}
                      <td>{item.jobTitle}</td>
                      <td>
                        <button onClick={() => toggleExpandRow(itemKey)}>
                          {isExpanded ? "Hide" : "Show"}
                        </button>
                        {isExpanded && (
                          <div className="expanded-job-scope">
                            {groupedData[company][jobTitle].map((subItem) => (
                              <div key={subItem.jobScope}>
                                {subItem.jobScope}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>{item.count}</td>
                      <td>
                        <select
                          value={selectedInterest}
                          onChange={(e) =>
                            handleInterestChange(itemKey, e.target.value)
                          }
                        >
                          {options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {selectedInterest !== "Agreeable" && (
                          <input
                            type="text"
                            placeholder="Reason"
                            value={reason}
                            onChange={(e) =>
                              handleReasonChange(itemKey, e.target.value)
                            }
                          />
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="save-button-container">
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SupervisorInterestPage;
