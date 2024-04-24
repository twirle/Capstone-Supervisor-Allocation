import React, { useState, useEffect } from "react";

function FacultyRatingPage({ token }) {
  const [students, setStudents] = useState([]);
  const [ratings, setRatings] = useState({}); // key: studentId, value: rating

  useEffect(() => {
    fetch("/api/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleRatingChange = (studentId, rating) => {
    setRatings({ ...ratings, [studentId]: rating });
  };

  // const submitRatings = () => {
  //   // Iterate over ratings and send them to the backend
  //   Object.entries(ratings).forEach(([studentId, rating]) => {
  //     fetch(`/api/faculty/${facultyId}/rate`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ studentId, rating }),
  //     });
  //   });
  // };

  return (
    <div>
      <h1>Rate Students</h1>
      {students.map((student) => (
        <div key={student._id}>
          <h2>{student.name}</h2>
          <select
            value={ratings[student._id] || ""}
            onChange={(e) => handleRatingChange(student._id, e.target.value)}
          >
            <option value="Full acceptance">Full acceptance</option>
            <option value="Agreeable">Agreeable</option>
            <option value="Conflict of interest">Conflict of interest</option>
            <option value="Do not want to supervise">
              Do not want to supervise
            </option>
          </select>
        </div>
      ))}
      {/* <button onClick={submitRatings}>Submit Ratings</button> */}
    </div>
  );
}

export default FacultyRatingPage;
