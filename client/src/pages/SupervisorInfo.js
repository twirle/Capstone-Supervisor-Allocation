import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { fetchSupervisorDetails } from "../services/supervisorService";
import "../css/supervisorInfo.css";

function SupervisorInfo({ userId }) {
  const [loading, setLoading] = useState(false);
  const [supervisor, setSupervisor] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    if (user.role !== "supervisor") {
      setError("User is not a supervisor");
    }

    setLoading(true);
    fetchSupervisorDetails(user)
      .then((data) => {
        console.log("Fetched supervisor data:", data);
        setSupervisor(data);
      })
      .catch((error) => {
        console.error("Failed to load supervisor details", error);
        setError("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}..</p>;
  if (!supervisor) return <p>Supervisor information is not available</p>;

  return (
    <div className="supervisor-info-container">
      <h2>Assigned Students</h2>
      <table className="table-style">
        <thead>
          <tr>
            <th>Name</th>
            <th>Faculty</th>
            <th>Course</th>
            <th>Job Title</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {supervisor.assignedStudents.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.faculty.name}</td>
              <td>{student.course}</td>
              <td>{student.job.title}</td>
              <td>{student.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupervisorInfo;
