process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp);

describe('Mentor User Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let mentorId
    let facultyId
    let researchArea

    before(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB for testing');
        } catch (err) {
            console.error('Database connection error', err.message);
            throw err;
        }

        // Admin login to obtain authToken
        try {
            const loginResponse = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: process.env.TEST_USER_EMAIL,
                    password: process.env.TEST_USER_PASSWORD
                });

            expect(loginResponse).to.have.status(200)
            adminToken = loginResponse.body.token
        } catch (err) {
            console.error('Failed to login', err.message)
            throw err
        }

        // Fetch an existing faculty
        try {
            const facultyResponse = await chai.request(server)
                .get('/api/faculty')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(facultyResponse).to.have.status(200);
            expect(facultyResponse.body).to.be.an('array').that.is.not.empty;

            faculty = facultyResponse.body[0]
            facultyId = faculty._id
            courses = faculty.courses

            console.log('facultyID:', facultyId)
            console.log('faculty name:', faculty.name)
            console.log('faculty courses:', courses)

            researchArea = courses[0]

        } catch (err) {
            console.error('Failed to fetch faculty', err.message);
            throw err;
        }
    });

    after(async () => {
        try {
            await mongoose.disconnect()
            console.log('Disconnected from MongoDB')
        } catch (err) {
            console.error('Error disconnecting from MongoDB', err.message)
            throw err
        }
    });

    // Test case to create mentor user
    describe('Create mentor /user', () => {
        it('create an mentor user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'mentortest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'mentor',
                    additionalInfo: {
                        name: 'Test Mentor',
                        faculty: facultyId,
                        researchArea: researchArea
                    }
                })

            if (resCreate.status !== 201) {
                console.error('Failed to create mentor user:', resCreate.body)
            }
            expect(resCreate).to.have.status(201)
        })
    })

    // Test case to login to the new mentor user
    describe('Login mentor /user', () => {
        it('login the mentor user and get a token', async () => {
            const resLogin = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'mentortest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'mentor'
                })

            mentorId = resLogin.body.id
            expect(resLogin).to.have.status(200)
        })
    })

    // test case to try get created mentor's profile
    describe('Get mentor /user', () => {
        it('should get the mentor profile', async () => {
            const res = await chai.request(server)
                .get(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('faculty');
        })
    })

    // Test case to amend mentor user password
    // WIP to allow password amendments

    // Test case to delete mentor user and also Mentor
    describe('Delete mentor /user', () => {
        it('delete the mentor user and ensure profile is also deleted', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(204);

            // Check if the related mentor profile is also deleted
            const checkProfile = await chai.request(server)
                .get(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(checkProfile.status).to.equal(404)
        });
    });

})
