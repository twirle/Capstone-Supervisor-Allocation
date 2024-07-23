import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { fetchStudentDetails } from "../services/studentService";
import "../css/studentInfo.css";

function StudentInfo({ userId }) {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    setLoading(true);
    fetchStudentDetails(user)
      .then((data) => {
        console.log("Fetched student data:", data);
        setStudent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load student details", error);
        setError("Failed to fetch data");
        setLoading(false);
      });
    setLoading(false);
  }, [userId]);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}..</p>;
  if (user.role !== "student") return <p> User is not a student</p>;
  if (!student) return <p>Student information is not available</p>;

  return (
    <div className="student-info-container">
      <h2>Assigned Supervisor</h2>
      <table className="table-style">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Faculty</th>
            <th>Research Area</th>
          </tr>
        </thead>
        <tbody>
          {student.assignedSupervisor && (
            <tr key={student.assignedSupervisor._id}>
              <td>{student.assignedSupervisor.name}</td>
              <td>{student.assignedSupervisor.user.email}</td>
              <td>{student.assignedSupervisor.faculty.name}</td>
              <td>{student.assignedSupervisor.researchArea.join(", ")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentInfo;
