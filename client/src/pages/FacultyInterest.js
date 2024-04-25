import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/facultyInterestPage.css";

const FacultyInterestPage = () => {
  const [data, setData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [interests, setInterests] = useState("");
  const options = [
    "Full acceptance",
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
          setData(result);
          const uniqueFaculties = [...new Set(result.map((item) => item.faculty))];
          setFaculties(uniqueFaculties);
          if (uniqueFaculties.length > 0) {
            const initialFaculty = uniqueFaculties[0];
            setSelectedFaculty(initialFaculty);
            const facultyCourses = result
              .filter((item) => item.faculty === initialFaculty)
              .map((item) => item.course);
            setCourses([...new Set(facultyCourses)]);
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
    // Update courses and companies based on selected faculty
    if (selectedFaculty) {
      const facultyCourses = data
        .filter((item) => item.faculty === selectedFaculty)
        .map((item) => item.course);
      setCourses([...new Set(facultyCourses)]);
      const relevantData = data.filter(item => item.faculty === selectedFaculty);
      const uniqueCompanies = [...new Set(relevantData.map(item => item.company))];
      setCompanies(uniqueCompanies);
      setSelectedCourse(""); // Reset selected course when faculty changes
      setSelectedCompany(""); // Reset company when faculty changes
    } else {
      setCourses([]);
      setSelectedCourse("");
      setCompanies([]);
      setSelectedCompany("");
    }
  }, [selectedFaculty, data]);

  useEffect(() => {
    // Update companies based on selected course
    if (selectedCourse) {
      const relevantData = data.filter(item => 
        item.faculty === selectedFaculty && item.course === selectedCourse
      );
      const uniqueCompanies = [...new Set(relevantData.map(item => item.company))];
      setCompanies(uniqueCompanies);
      setSelectedCompany(""); // Reset company when course changes
    }
  }, [selectedCourse, data]);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleInterestChange = (itemKey, value) => {
    setInterests((prev) => ({ ...prev, [itemKey]: value }));
  };

  const filteredData = data.filter(
    (item) =>
      (selectedFaculty ? item.faculty === selectedFaculty : true) &&
      (selectedCourse ? item.course === selectedCourse : true) &&
      (selectedCompany ? item.company === selectedCompany : true)
  );

  return (
    <div className="faculty-interest-container">
      <h1>Faculty Interest</h1>
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
        <select value={selectedCourse} onChange={handleCourseChange}>
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map((company, idx) => (
            <option key={idx} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>
      <table className="table-style">
        <thead>
          <tr>
            <th>Course</th>
            <th>Company</th>
            <th>Job Scope</th>
            <th>Pax</th>
            <th>Interest</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => {
            const itemKey = `${item.faculty}_${item.course}_${item.company}`;
            return (
              <tr key={index}>
                <td>{item.course}</td>
                <td>{item.company}</td>
                <td>{}</td>
                <td>{item.count}</td>
                <td>
                  <select
                    value={interests[itemKey] || ""}
                    onChange={(e) =>
                      handleInterestChange(itemKey, e.target.value)
                    }
                  >
                    <option value="">Select Interest</option>
                    {options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyInterestPage;
