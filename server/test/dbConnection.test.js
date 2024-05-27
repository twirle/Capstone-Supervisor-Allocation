// npm install --save-dev mocha chai dotenv mongoose

// Set test environment when connecting to database
process.env.NODE_ENV = "test";
process.env.PORT = 4001;

// Import modules
import dotenv from "dotenv";
import mongoose from "mongoose";
import { expect, use } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);

// Load environment variables
dotenv.config();

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;

describe("MongoDB Connection using Mongoose", () => {
  before(async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      throw err;
    }
  });

  it("should connect to MongoDB without errors", () => {
    expect(mongoose.connection.readyState).to.equal(1); // 1 means connected
  });

  after(async () => {
    try {
      await mongoose.disconnect();
    } catch (err) {
      throw err;
    }
  });
});
