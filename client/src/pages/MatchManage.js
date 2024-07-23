import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import MatchTable from "../components/matchTable";
import { fetchMatches } from "../services/matchResultService";
import "../css/matchManage.css";
import {
  greedyMatch,
  hungarianMatch,
  galeShapleyMatch,
  resetAssignments,
  kMeansMatch,
} from "../services/matchingService";

function MatchManage({ userId }) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(10);

  const { user } = useAuthContext();

  useEffect(() => {
    if (user.role !== "admin") {
      setError("User is not a admin");
      return;
    }
    loadMatches();
  }, [user.token]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const fetchedMatches = await fetchMatches(user.token);
      setMatches(fetchedMatches);
    } catch (error) {
      console.log("Error fetching matches", error);
      setError("Error fetching matches", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches
    .filter(
      (match) =>
        match.supervisor.name.toLowerCase().includes(filter.toLowerCase()) ||
        match.student.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.score - a.score);

  // Pagination
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleHungarianMatch = async () => {
    try {
      setLoading(true);
      await hungarianMatch(user.token);
      await loadMatches();
    } catch (error) {
      setError("Failed to execute match", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGreedyMatch = async () => {
    try {
      setLoading(true);
      await greedyMatch(user.token);
      await loadMatches();
    } catch (error) {
      setError("Failed to execute match", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGaleShapleyMatch = async () => {
    try {
      setLoading(true);
      await galeShapleyMatch(user.token);
      await loadMatches();
    } catch (error) {
      setError("Failed to execute match", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKMeansMatch = async () => {
    try {
      setLoading(true);
      await kMeansMatch(user.token);
      await loadMatches();
    } catch (error) {
      setError("Failed to execute match", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetAssignments(user.token);
      await loadMatches();
    } catch (error) {
      setError("Failed to reset matches", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}..</p>;

  return (
    <div className="match-manage-container">
      <h1>Match Management</h1>
      <div className="top-controls">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search by Supervisor or Student"
            value={filter}
            onChange={(change) => setFilter(change.target.value)}
          />
        </div>
        <div className="match-buttons">
          <button
            className="match-button"
            disabled={loading}
            onClick={handleHungarianMatch}
          >
            Hungarian Match
          </button>
          <button
            className="match-button"
            disabled={loading}
            onClick={handleGreedyMatch}
          >
            Greedy Match
          </button>
          <button
            className="match-button"
            disabled={loading}
            onClick={handleGaleShapleyMatch}
          >
            Gale-Shapley Match
          </button>
          <button
            className="match-button"
            disabled={loading}
            onClick={handleKMeansMatch}
          >
            k-Means Match
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
      <MatchTable matches={currentMatches} />
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredMatches.length / matchesPerPage) },
          (_, index) => (
            <button
              key={index}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
export default MatchManage;
