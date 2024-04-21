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
    origin: ["https://server-twirles-projects.vercel.app"],
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
    autoReconnect: true, // Automatically try to reconnect when it loses connection to MongoDB
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000, // Reconnect every 1000ms
  })
  .catch((err) => console.error("MongoDB connection error:", err));

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

app.get("*", (req, res) => {
  res.send("Welcome to the API!");
});

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies with requests
  body: JSON.stringify(data),
});

app.listen(process.env.PORT),
  () => {
    console.log("server is running", process.env.PORT);
  };

module.exports = app;
