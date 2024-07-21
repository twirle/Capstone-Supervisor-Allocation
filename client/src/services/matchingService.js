const apiUrl = process.env.REACT_APP_API_URL;

export const jaccardMatch = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/jaccardMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to execute Jaccard match");
    }
    console.log("Jaccard match executed successfully");
    return await response.json(); // Assuming the server might send back some data
  } catch (error) {
    console.error("Error executing matches", error.message);
    throw error;
  }
};

export const resetAssignments = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to reset assignments");
    }
    console.log("Assignments reset successfully");
    return await response.json();
  } catch (error) {
    console.error("Error executing matches", error.message);
    throw error;
  }
};
