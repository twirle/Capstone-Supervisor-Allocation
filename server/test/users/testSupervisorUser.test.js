process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp);

describe('Supervisor User Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let supervisorId
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

    // Test case to create supervisor user
    describe('Create supervisor /user', () => {
        it('create an supervisor user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'supervisortest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'supervisor',
                    additionalInfo: {
                        name: 'Test Supervisor',
                        faculty: facultyId,
                        researchArea: researchArea
                    }
                })

            if (resCreate.status !== 201) {
                console.error('Failed to create supervisor user:', resCreate.body)
            }
            expect(resCreate).to.have.status(201)
        })
    })

    // Test case to login to the new supervisor user
    describe('Login supervisor /user', () => {
        it('login the supervisor user and get a token', async () => {
            const resLogin = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'supervisortest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'supervisor'
                })

            supervisorId = resLogin.body.id
            expect(resLogin).to.have.status(200)
        })
    })

    // test case to try get created supervisor's profile
    describe('Get supervisor /user', () => {
        it('should get the supervisor profile', async () => {
            const res = await chai.request(server)
                .get(`/api/supervisor/${supervisorId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('faculty');
        })
    })

    // Test case to amend supervisor user password
    // WIP to allow password amendments

    // Test case to delete supervisor user and also Supervisor
    describe('Delete supervisor /user', () => {
        it('delete the supervisor user and ensure profile is also deleted', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${supervisorId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(204);

            // Check if the related supervisor profile is also deleted
            const checkProfile = await chai.request(server)
                .get(`/api/supervisor/${supervisorId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(checkProfile.status).to.equal(404)
        });
    });

})
