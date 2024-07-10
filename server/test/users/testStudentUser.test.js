// Set environment variable
process.env.NODE_ENV = "test";
process.env.PORT = 4001;

// Import modules
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../../index.js";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);

dotenv.config();

describe("Student User Flow Test", function () {
  this.timeout(15000);
  let adminToken;
  let studentId;
  let facultyId;
  let facultyIdNew;
  let course;
  let courseNew;

  before(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB for testing");
    } catch (err) {
      console.error("Database connection error", err.message);
      throw err;
    }

    // Admin login to obtain authToken
    try {
      const loginResponse = await chai
        .request(server)
        .post("/api/user/login")
        .send({
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
        });

      expect(loginResponse).to.have.status(200);
      adminToken = loginResponse.body.token;
    } catch (err) {
      console.error("Failed to login", err.message);
      throw err;
    }

    // Fetch an existing faculty
    try {
      const facultyResponse = await chai
        .request(server)
        .get("/api/faculty")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(facultyResponse).to.have.status(200);
      expect(facultyResponse.body).to.be.an("array").that.is.not.empty;

      let faculty = facultyResponse.body[0];
      facultyId = faculty._id;
      facultyIdNew = facultyResponse.body[1]._id;

      let courses = faculty.courses;

      console.log("facultyID:", facultyId);
      console.log("faculty name:", faculty.name);
      console.log("faculty courses:", courses);

      course = courses[0];
      courseNew = courses[1];
    } catch (err) {
      console.error("Failed to fetch faculty", err.message);
      throw err;
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (err) {
      console.error("Error disconnecting from MongoDB", err.message);
      throw err;
    }
  });

  // Test case to create student user
  describe("Create student /user", () => {
    it("create an student user", async () => {
      const resCreate = await chai
        .request(server)
        .post("/api/user/signup")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "studenttest@sit.edu.sg",
          password: "testASD123!@#",
          role: "student",
          additionalInfo: {
            name: "Test Student",
            faculty: facultyId,
            course: course,
            company: "Nestle",
            jobScope: "Quality Control",
          },
        });

      if (resCreate.status !== 201) {
        console.error("Failed to create supervisor user:", resCreate.body);
      }
      expect(resCreate).to.have.status(201);
    });
  });

  // Test case to login to the new student user
  describe("Login student /user", () => {
    it("login the student user and get a token", async () => {
      const resLogin = await chai.request(server).post("/api/user/login").send({
        email: "studenttest@sit.edu.sg",
        password: "testASD123!@#",
      });

      studentId = resLogin.body.id;
      expect(resLogin).to.have.status(200);
    });
  });

  // test case to try get created student's profile
  describe("Get student /user", () => {
    it("should get the student profile", async () => {
      const res = await chai
        .request(server)
        .get(`/api/student/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name");
      expect(res.body).to.have.property("faculty");
    });
  });

  // Test case to amend student user password
  // WIP to allow password amendments

  describe("Delete student /user", () => {
    it("delete the student user", async () => {
      const resDelete = await chai
        .request(server)
        .delete(`/api/user/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(resDelete).to.have.status(204);

      // Check if the related supervisor profile is also deleted
      const checkProfile = await chai
        .request(server)
        .get(`/api/student/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(checkProfile.status).to.equal(404);
    });
  });
});
