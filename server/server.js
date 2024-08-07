import { config as dotenvConfig } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import studentRoutes from "./routes/student.js";
import supervisorRoutes from "./routes/supervisor.js";
import facultyMemberRoutes from "./routes/facultyMember.js";
import facultyRoutes from "./routes/faculty.js";
import companyRoutes from "./routes/company.js";
import jobRoutes from "./routes/job.js";
import matchRoutes from "./routes/match.js";
import supervisorInterestRoutes from "./routes/supervisorInterest.js";
import cors from "cors";

// Load environment variables
dotenvConfig({ path: new URL(".env", import.meta.url) });

const app = express();

app.use(
  cors({
    origin: ["http://client-kohl-eight.vercel.app"], // Change this to match your frontend URL
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/facultyMember", facultyMemberRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/supervisorInterest", supervisorInterestRoutes);

// Error handling middleware (this should be the LAST middleware before you connect to DB and listen on a port)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Only connect to DB and listen on port if NOT in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      console.error("Connection error:", error);
    });
}

export default app;
