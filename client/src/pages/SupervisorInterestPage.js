import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/supervisorInterestPage.css";

const SupervisorInterestPage = () => {
  const [data, setData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobScopes, setJobScopes] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobScope, setSelectedJobScope] = useState("");
  const [interests, setInterests] = useState({});
  const [reasons, setReasons] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const options = [
    "Full acceptance",
    "Agreeable",
    "Conflict of interest",
    "Do not want to supervise",
  ];

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Log the user object to see its structure and content
  console.log("User object:", user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/student/aggregate`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const result = await response.json();
        if (response.ok) {
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
            setCompanies(uniqueCompanies);
            setJobScopes([
              ...new Set(relevantData.map((item) => item.jobScope)),
            ]);
          }
        } else {
          throw new Error(result.message || "Error fetching data");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
      }
    };
    fetchData();
  }, [apiUrl, user.token]);

  useEffect(() => {
    if (selectedFaculty) {
      const relevantData = data.filter(
        (item) => item.faculty === selectedFaculty
      );
      const uniqueCompanies = [
        ...new Set(relevantData.map((item) => item.company)),
      ];
      setCompanies(uniqueCompanies);
      setJobScopes([...new Set(relevantData.map((item) => item.jobScope))]);
      setSelectedCompany("");
      setSelectedJobScope("");
    } else {
      setCompanies([]);
      setSelectedCompany("");
      setJobScopes([]);
      setSelectedJobScope("");
    }
  }, [selectedFaculty, data]);

  useEffect(() => {
    if (selectedCompany) {
      const relevantData = data.filter(
        (item) =>
          item.faculty === selectedFaculty && item.company === selectedCompany
      );
      const uniqueJobScopes = [
        ...new Set(relevantData.map((item) => item.jobScope)),
      ];
      setJobScopes(uniqueJobScopes);
      setSelectedJobScope("");
    }
  }, [selectedCompany, data]);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleJobScopeChange = (e) => {
    setSelectedJobScope(e.target.value);
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

      const response = await fetch(`${apiUrl}/api/supervisorInterest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(
          Object.entries(interests).map(([key, value]) => {
            const [company, jobScope] = key.split("_");
            return {
              supervisor: supervisorId,
              company,
              jobScope,
              interest: value,
              reason: reasons[key] || "",
            };
          })
        ),
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

  const filteredData = data
    .filter(
      (item) =>
        (selectedFaculty ? item.faculty === selectedFaculty : true) &&
        (selectedCompany ? item.company === selectedCompany : true) &&
        (selectedJobScope ? item.jobScope === selectedJobScope : true)
    )
    .sort(
      (a, b) =>
        a.company.localeCompare(b.company) ||
        a.jobScope.localeCompare(b.jobScope)
    );

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
        <select value={selectedJobScope} onChange={handleJobScopeChange}>
          <option value="">All Job Scopes</option>
          {jobScopes.map((jobScope, idx) => (
            <option key={idx} value={jobScope}>
              {jobScope}
            </option>
          ))}
        </select>
      </div>
      <table className="table-style">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Scope</th>
            <th>Pax</th>
            <th>Interest</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => {
            const itemKey = `${item.faculty}_${item.company}_${item.jobScope}`;
            const selectedInterest = interests[itemKey] || "Agreeable";
            return (
              <tr key={index}>
                <td>{item.company}</td>
                <td>{item.jobScope}</td>
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
                      value={reasons[itemKey] || ""}
                      onChange={(e) =>
                        handleReasonChange(itemKey, e.target.value)
                      }
                    />
                  )}
                </td>
              </tr>
            );
          })}
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
