const apiUrl = process.env.REACT_APP_API_URL;

export const fetchSupervisorDetails = async (user) => {
  try {
    const response = await fetch(`${apiUrl}/api/supervisor/${user._id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch supervisor details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching supervisor details", error);
    throw error;
  }
};
