// npm install mocha chai dotenv mongoose
// npx mocha dbConnection.test.js

// set test environment when connecting to database
process.env.NODE_ENV = 'test';

require('dotenv').config();

const mongoose = require('mongoose');
const chai = require('chai');

const expect = chai.expect;

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;

describe('MongoDB Connection using Mongoose', () => {

    before((done) => {
        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => done())
            .catch(err => done(err));
    });

    it('should connect to MongoDB without errors', (done) => {
        expect(mongoose.connection.readyState).to.equal(1); // 1 means connected
        done();
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    });
});
