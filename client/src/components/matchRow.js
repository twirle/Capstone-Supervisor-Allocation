import React, { useState } from "react";
import "../css/matchManage.css";

function MatchRow({ match }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const supervisor = match.supervisor;
  const student = match.student;

  return (
    <tr onClick={toggleExpand} style={{ cursor: "pointer" }}>
      <td>
        {supervisor.name}
        {expanded && (
          <div className="detail-section">
            <p className="detail-item">
              <strong>Faculty:</strong> {supervisor.faculty.name}
            </p>
            <p className="detail-item">
              <strong>Research Areas:</strong>{" "}
              {match.supervisor.researchArea.join(", ")}
            </p>
          </div>
        )}
      </td>
      <td>
        {student ? (
          <>
            {student.name}
            {expanded && (
              <div className="detail-section">
                <p className="detail-item">
                  <strong>Faculty:</strong> {student.faculty.name}
                </p>
                <p className="detail-item">
                  <strong>Course:</strong> {student.course}
                </p>
                <p className="detail-item">
                  <strong>Company:</strong> {student.company.name || "N/A"}
                </p>
                <p className="detail-item">
                  <strong>Job Title:</strong> {student.job.title || "N/A"}
                </p>
              </div>
            )}
          </>
        ) : (
          "No student assigned"
        )}
      </td>
      <td>{match.score.toFixed(3)}</td>
      {/* <td>{expanded ? "Hide Details" : "Show Details"}</td> */}
    </tr>
  );
}

export default MatchRow;
