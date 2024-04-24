import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/facultyRatingPage.css";

const FacultyRatingPage = () => {
  const [data, setData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("");

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
          setFaculties([...new Set(result.map((item) => item.faculty))]);
          // Set courses for initially selected faculty if applicable
          if (faculties.length > 0) {
            const initialFaculty = faculties[0];
            setSelectedFaculty(initialFaculty);
            setCourses([
              ...new Set(
                result
                  .filter((item) => item.faculty === initialFaculty)
                  .map((item) => item.course)
              ),
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
    // Update courses based on selected faculty
    if (selectedFaculty) {
      const facultyCourses = data
        .filter((item) => item.faculty === selectedFaculty)
        .map((item) => item.course);
      setCourses([...new Set(facultyCourses)]);
      setSelectedCourse(""); // Reset selected course when faculty changes
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
  }, [selectedFaculty, data]);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    // setCourses([
    //   ...new Set(
    //     data
    //       .filter((item) => item.faculty === faculty)
    //       .map((item) => item.course)
    //   ),
    // ]);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      (selectedFaculty ? item.faculty === selectedFaculty : true) &&
      (selectedCourse ? item.course === selectedCourse : true)
  );

  return (
    <div className="faculty-rating-container">
      <h1>Faculty Ratings</h1>
      <div className="faculty-buttons">
        {faculties.map((faculty) => (
          <button
            key={faculty}
            className={
              selectedFaculty === faculty ? "faculty-button active" : "faculty-button"
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
      </div>
      <table className="table-style">
        <thead>
          <tr>
            <th>Course</th>
            <th>Faculty</th>
            <th>Company</th>
            <th>Pax</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.course}</td>
              <td>{item.faculty}</td>
              <td>{item.company}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyRatingPage;
