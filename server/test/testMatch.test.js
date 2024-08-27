process.env.NODE_ENV = "test";
process.env.PORT = 4001;

import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../index.js";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);

dotenv.config();

describe("Matching Test", () => {
  let authToken;

  before(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB for testing");

      // Login before tests run to obtain authToken
      const loginResponse = await chai
        .request(server)
        .post("/api/user/login")
        .send({
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
        });

      expect(loginResponse).to.have.status(200);
      authToken = loginResponse.body.token;
    } catch (err) {
      console.error("Setup error", err.message);
      throw err;
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (err) {
      console.error("Teardown error", err.message);
      throw err;
    }
  });

  // test case run matching
  describe("Run match", () => {
    it("should successfully complete the matching process", async () => {
      console.time("Matching time");

      const resetResponse = await chai
        .request(server)
        .post("/api/match/reset")
        .set("Authorization", `Bearer ${authToken}`);

      expect(resetResponse).to.have.status(200);

      const matchResponse = await chai
        .request(server)
        .post("/api/match/hungarianMatch")
        .set("Authorization", `Bearer ${authToken}`);

      expect(matchResponse).to.have.status(200);
      console.timeEnd("Matching time");

      console.log("Compatibility Matrix:", matchResponse.body.scoresMatrix);
    });
  });
});
