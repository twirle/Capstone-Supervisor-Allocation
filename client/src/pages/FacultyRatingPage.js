import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const FacultyRatingPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/student/aggregate", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const result = await response.json();
        console.log("result", result);
        if (response.ok) {
          setData(result);
        } else {
          throw new Error(result.message || "Error fetching data");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (index) => {
    setExpandedRow(index === expandedRow ? null : index);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Faculty Ratings</h1>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Faculty</th>
            <th>Company</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <React.Fragment key={index}>
                <tr onClick={() => handleRowClick(index)}>
                  <td>{item.course}</td>
                  <td>{item.faculty}</td>
                  <td>{item.company}</td>
                  <td>{item.count}</td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan="4">
                      <div>
                        {item.students.map((student) => (
                          <div key={student._id}>{student.name}</div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyRatingPage;
