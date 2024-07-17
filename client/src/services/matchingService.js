const apiUrl = process.env.REACT_APP_API_URL;

export const jaccardMatch = async (userToken, setLoading, setError) => {
  setLoading(true);
  try {
    const response = await fetch(`${apiUrl}/api/match/jaccardMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      console.log("Jaccard match executed successfully");
    } else {
      console.error("Failed to execute jaccard match");
    }
  } catch (error) {
    console.log("Error in matching");
    setError("Error in matching");
  } finally {
    setLoading(false);
  }
};

export const resetAssignments = async (userToken, setLoading, setError) => {
  // Call endpoint to reset assignments
  setLoading(true);
  try {
    const response = await fetch(`${apiUrl}/api/match/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      console.log("Assignments reset successfully");
    } else {
      console.error("Failed to reset assignments");
    }
  } catch (err) {
    console.log("Error resetting assignments");
    setError("Error resetting assignments");
  } finally {
    setLoading(false);
  }
};
