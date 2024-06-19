process.env.NODE_ENV = "test";
process.env.PORT = 4001;

import dotenv from "dotenv";
import mongoose from "mongoose";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";

dotenv.config();
const chai = use(chaiHttp);

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
  describe("Run and Reset Matching", () => {
    it("should successfully complete and average the matching process", async () => {
      let totalMatchingTime = 0;
      const numRuns = 5;

      for (let i = 0; i < numRuns; i++) {
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

        const matchingTime = console.timeEnd("Matching time");
        totalMatchingTime += matchingTime;
        console.log(`Run ${i + 1} - Matching time: ${matchingTime}ms`);
      }

      const averageMatchingTime = totalMatchingTime / numRuns;
      console.log(`Average Matching Time: ${averageMatchingTime.toFixed(2)}ms`);
    });
  });
});
