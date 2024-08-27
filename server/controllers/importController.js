import multer from "multer";
import {
  importStudents,
  importSupervisors,
} from "../services/importService.js";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const handleFileImport = async (req, res) => {
  console.log("handleFileImport called");
  const file = req.file;
  const role = req.body.role;

  console.log("File received:", file);
  console.log("Role received:", role);

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." }); // Ensure JSON response
  }

  try {
    if (role === "student") {
      await importStudents(file.buffer);
    } else if (role === "supervisor") {
      await importSupervisors(file.buffer);
    } else {
      return res.status(400).json({ error: "Invalid role specified." }); // Ensure JSON response
    }

    res.status(200).json({ message: "File imported successfully." }); // Ensure JSON response
  } catch (error) {
    console.error("Error during import:", error);
    res.status(500).json({ error: "Error during import." }); // Ensure JSON response
  }
};

export { upload, handleFileImport };
