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
            <div className="detail-item">
              <strong>Faculty:</strong>{" "}
              <span className="detail-value">{supervisor.faculty.name}</span>
            </div>
            <div className="detail-item">
              <strong>Research Areas:</strong>{" "}
              <span className="detail-value">
                {match.supervisor.researchArea.join(", ")}
              </span>
            </div>
          </div>
        )}
      </td>
      <td>
        {student ? (
          <>
            {student.name}
            {expanded && (
              <div className="detail-section">
                <div className="detail-item">
                  <strong>Faculty:</strong>{" "}
                  <span className="detail-value">{student.faculty.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Course:</strong>{" "}
                  <span className="detail-value">{student.course}</span>
                </div>
                <div className="detail-item">
                  <strong>Company:</strong>{" "}
                  <span className="detail-value">
                    {student.company.name || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Job Title:</strong>{" "}
                  <span className="detail-value">
                    {student.job.title || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Tokens:</strong>{" "}
                  {student.job.tokens.length > 0 ? (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                    >
                      {student.job.tokens.map((token, index) => (
                        <span key={index} className="token-item">
                          {token}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
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
