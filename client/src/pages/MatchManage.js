import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/matchManage.css";
import { jaccardMatch, resetAssignments } from "../services/matchingService";

function MatchManage({ userId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();
  const apiUrl = process.env.REAC_APP_API_URL;

  useEffect(() => {
    if (user.role !== "admin") {
      setError("User is not a admin");
      return;
    }
  });

  const handleJaccardMatch = () => {
    jaccardMatch(user.token, setLoading, setError);
  };

  const handleReset = () => {
    resetAssignments(user.token, setLoading, setError);
  };

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}..</p>;

  return (
    <div className="match-manage-container">
      <h1>Match Management</h1>
      <div className="match-buttons">
        <button
          className="match-button"
          disabled={loading}
          onClick={handleJaccardMatch}
        >
          Jaccard Match
        </button>
        <button
          className="match-button"
          disabled={loading}
          onClick={handleReset}
        >
          Reset Matches
        </button>
      </div>
    </div>
  );
}
export default MatchManage;
