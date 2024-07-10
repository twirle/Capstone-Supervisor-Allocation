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

// Load environment variables
dotenv.config();

// Describe the test suite
describe("Admin User Flow Test", function () {
  this.timeout(15000);
  let originalAdminToken;
  let adminToken;
  let adminUserId;

  // Before hook
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
      originalAdminToken = loginResponse.body.token;
    } catch (err) {
      console.error("Failed to login", err.message);
      throw err;
    }
  });

  // After hook
  after(async () => {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (err) {
      console.error("Error disconnecting from MongoDB", err.message);
      throw err;
    }
  });

  // Test case to create admin user
  describe("Create admin /user", () => {
    it("create an admin user", async () => {
      const resCreate = await chai
        .request(server)
        .post("/api/user/signup")
        .set("Authorization", `Bearer ${originalAdminToken}`)
        .send({
          email: "admintest@sit.edu.sg",
          password: "testASD123!@#",
          role: "admin",
        });

      // console.log('response:', resCreate.body)
      expect(resCreate).to.have.status(201);
    });
  });

  // Test case to login to the new admin user
  describe("Login admin /user", () => {
    it("login the admin user and get a token", async () => {
      const resLogin = await chai.request(server).post("/api/user/login").send({
        email: "admintest@sit.edu.sg",
        password: "testASD123!@#",
      });

      adminToken = resLogin.body.token;
      adminUserId = resLogin.body.id;
      expect(resLogin).to.have.status(200);
    });
  });

  // Test case to delete admin user
  describe("Delete admin /user", () => {
    it("should delete the admin user", async () => {
      const resDelete = await chai
        .request(server)
        .delete(`/api/user/${adminUserId}`)
        .set("Authorization", `Bearer ${originalAdminToken}`);

      expect(resDelete).to.have.status(204);
    });
  });
});
