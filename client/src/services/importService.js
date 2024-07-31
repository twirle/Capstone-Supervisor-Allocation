const apiUrl = process.env.REACT_APP_API_URL;

class ImportService {
  static uploadFile(file, userToken, role) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    return fetch(`${apiUrl}/api/user/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        return response.json();
      })
      .catch((err) => {
        console.error("Error during file upload:", err);
        throw err;
      });
  }
}

export default ImportService;
