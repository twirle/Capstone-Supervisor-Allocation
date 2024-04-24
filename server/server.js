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

const corsOptions = {
  origin: ["http://localhost:3000"], // Change this to match your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));

// Parse JSON requests‰
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
  console.log(req.path, req.method);
  next();
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

module.exports = app;

  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
