process.env.NODE_ENV = 'test';

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const server = require('../server')

chai.use(chaiHttp)

describe('Matching Test', () => {
    let authToken;

    before(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB for testing');

            // Login before tests run to obtain authToken
            const loginResponse = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: process.env.TEST_USER_EMAIL,
                    password: process.env.TEST_USER_PASSWORD
                });

            expect(loginResponse).to.have.status(200);
            authToken = loginResponse.body.token;
            console.log('Obtained authToken:', authToken);
        } catch (err) {
            console.error('Setup error', err.message);
            throw err;
        }
    });

    after(async () => {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (err) {
            console.error('Teardown error', err.message);
            throw err;
        }
    });

    // test case run matching
    describe('Run match', () => {
        it('should successfully complete the matching process', async () => {
            const res = await chai.request(server)
                .post('/api/match/match')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            console.log('Compatibility Matrix:', res.body.scoresMatrix);
            console.log('Matches:', res.body.matches);
        });

    })

    // Additional tests related to the matching process can be added here
});
