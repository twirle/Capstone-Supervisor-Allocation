const apiUrl = process.env.REACT_APP_API_URL;

export const hungarianMatch = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/hungarianMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to execute Hungarian match");
    }
    console.log("Hungarian match executed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error executing matches", error.message);
    throw error;
  }
};

export const greedyMatch = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/greedyMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to execute Greedy match");
    }
    console.log("Greedy match executed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error executing matches", error.message);
    throw error;
  }
};

export const galeShapleyMatch = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/galeShapleyMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to execute Gale Shapley match");
    }
    console.log("Gale Shapley match match executed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error executing matches", error.message);
    throw error;
  }
};

export const kMeansMatch = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/match/kMeansMatch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to execute k-Means match");
    }
    console.log("k-Means match executed successfully");
    return await response.json();
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
