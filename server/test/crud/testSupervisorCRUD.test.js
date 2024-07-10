process.env.NODE_ENV = "test";
process.env.PORT = 4001;

import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../../index.js"; // Adjust the path as necessary
import { expect, use } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);

describe("Supervisor CRUD Flow Test", function () {
  this.timeout(15000);
  let adminToken;
  let supervisorId;
  let faculty;
  let facultyId;
  let facultyIdNew;
  let researchArea;
  let researchAreaNew;

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

      faculty = facultyResponse.body[0];
      let facultyNew = facultyResponse.body[1];
      facultyId = faculty._id;
      facultyIdNew = facultyNew._id;
      let courses = faculty.courses;
      let coursesNew = facultyNew.courses;

      // researchArea = courses[0];
      researchArea = '#chemicalEngineering'
      researchAreaNew = coursesNew[0];
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
  // Test case to create supervisor user
  describe("Create supervisor /user", () => {
    it("should create an supervisor user", async () => {
      const resCreate = await chai
        .request(server)
        .post("/api/user/signup")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "supervisortest@sit.edu.sg",
          password: "testASD123!@#",
          role: "supervisor",
          additionalInfo: {
            name: "Test Supervisor",
            faculty: facultyId,
            researchArea: researchArea,
          },
        });

      if (resCreate.status !== 201) {
        console.error("Failed to create supervisor user:", resCreate.body);
      }
      expect(resCreate).to.have.status(201);
      supervisorId = resCreate.body.user._id;
    });
  });

  // Test case to get all supervisors
  describe("Get all supervisor /api/supervisor", () => {
    it("should get all supervisors", async () => {
      const resGetAll = await chai
        .request(server)
        .get("/api/supervisor")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(resGetAll).to.have.status(200);
      expect(resGetAll.body.length).to.be.greaterThan(0);
    });
  });

  // Test case to get the created supervisor profile
  describe("Get the created supervisor /user", () => {
    it("should get the created supervisor profile", async () => {
      const res = await chai
        .request(server)
        .get(`/api/supervisor/${supervisorId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name");
      expect(res.body).to.have.property("faculty");
    });
  });

  // Test case to update a supervisor
  describe("Update supervisor /api/supervisor/:id", () => {
    it("should update the supervisor", async () => {
      const resUpdate = await chai
        .request(server)
        .patch(`/api/supervisor/${supervisorId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "updated supervisor name",
          faculty: facultyIdNew,
          researchArea: researchAreaNew,
        });
      expect(resUpdate).to.have.status(200);
    });
  });

  // Test case to delete supervisor user and profile
  describe("Delete supervisor /user", () => {
    it("delete the supervisor user and ensure profile is also deleted", async () => {
      const resDelete = await chai
        .request(server)
        .delete(`/api/user/${supervisorId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(resDelete).to.have.status(204);

      // Check if the related supervisor profile is also deleted
      const checkProfile = await chai
        .request(server)
        .get(`/api/supervisor/${supervisorId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(checkProfile.status).to.equal(404);
    });
  });
});
