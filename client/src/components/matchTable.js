import React, { useEffect, useState } from "react";
import MatchRow from "./matchRow";
import "../css/matchManage.css";

function MatchTable(matches) {
  const [sortedMatches, setSortedMatches] = useState([]);
  const validMatches = matches.matches;

  useEffect(() => {
    const sorted = [...validMatches].sort((a, b) => b.score - a.score);
    setSortedMatches(sorted);
  }, [validMatches]);

  return (
    <table className="table-style">
      <thead>
        <tr>
          <th>Supervisor</th>
          <th>Student</th>
          <th>Score</th>
          {/* <th>Details</th> */}
        </tr>
      </thead>
      <tbody>
        {sortedMatches.map((match) => (
          <MatchRow key={match._id} match={match} />
        ))}
      </tbody>
    </table>
  );
}

export default MatchTable;
