import React, { useState } from "react";
import "../css/matchManage.css";

function MatchRow({ match }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  return (
    <tr onClick={toggleExpand} style={{ cursor: "pointer" }}>
      <td>
        {match.supervisor.name}
        {expanded && (
          <div className="detail-section">
            <p className="detail-item">
              <strong>Faculty:</strong> {match.supervisor.faculty.name}
            </p>
            <p className="detail-item">
              <strong>Research Areas:</strong>{" "}
              {match.supervisor.researchArea.join(", ")}
            </p>
          </div>
        )}
      </td>
      <td>
        {match.student.name}
        {expanded && (
          <div className="detail-section">
            <p className="detail-item">
              <strong>Faculty:</strong> {match.student.faculty.name}
            </p>
            <p className="detail-item">
              <strong>Course:</strong> {match.student.course}
            </p>
            <p className="detail-item">
              <strong>Company:</strong> {match.student.company.name}
            </p>
            <p className="detail-item">
              <strong>Job Title:</strong> {match.student.job.title}
            </p>
          </div>
        )}
      </td>
      <td>{match.score.toFixed(3)}</td>
      {/* <td>{expanded ? "Hide Details" : "Show Details"}</td> */}
    </tr>
  );
}

export default MatchRow;
