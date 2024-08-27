const apiUrl = process.env.REACT_APP_API_URL;

export const fetchStudentDetails = async (user) => {
  try {
    const response = await fetch(`${apiUrl}/api/student/${user._id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch student details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student details", error);
    throw error;
  }
};
