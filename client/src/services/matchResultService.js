const apiUrl = process.env.REACT_APP_API_URL;

export const fetchMatches = async (userToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/matchResult`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch matches");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching matches:", error.message);
    throw error; // Throw the error to be caught by the component
  }
};
