const apiUrl = process.env.REACT_APP_API_URL;

export const fetchJobDetails = async (user, jobId) => {
  try {
    const response = await fetch(`${apiUrl}/api/job/${jobId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching job details", error);
    throw error;
  }
};
