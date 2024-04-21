require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const studentRoutes = require("./routes/student");
const mentorRoutes = require("./routes/mentor");
const facultyMemberRoutes = require("./routes/facultyMember");
const facultyRoutes = require("./routes/faculty");
const matchRoutes = require("./routes/match");

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: ["https://server-kohl-eight.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.json("Welcome to the API!");
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
// app.use('/api/admin', adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/facultyMember", facultyMemberRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/match", matchRoutes);

// Error handling middleware (this should be the LAST middleware before you connect to DB and listen on a port)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
