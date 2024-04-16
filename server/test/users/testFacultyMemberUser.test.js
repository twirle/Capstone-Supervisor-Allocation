process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp);

describe('Faculty Member User Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let facultyMemberId
    let facultyId

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

            console.log('facultyID:', facultyId)
            console.log('faculty name:', faculty.name)

        } catch (err) {
            console.error('Failed to fetch faculty', err.message);
            throw err;
        }
    })

    after(async () => {
        try {
            await mongoose.disconnect()
            console.log('Disconnected from MongoDB')
        } catch (err) {
            console.error('Error disconnecting from MongoDB', err.message)
            throw err
        }
    });

    // Test case to create faculty member user
    describe('Create faculty member /user', () => {
        it('create an faculty member user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'facultymembertest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'facultyMember',
                    additionalInfo: {
                        name: 'Test FacultyMember',
                        faculty: facultyId
                    }
                })

            if (resCreate.status !== 201) {
                console.error('Failed to create faculty member user:', resCreate.body)
            }
            expect(resCreate).to.have.status(201)
        })
    })

    // Test case to login to the new faculty member user
    describe('Login faculty member /user', () => {
        it('login the faculty member user and get a token', async () => {
            const resLogin = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'facultymembertest@sit.edu.sg',
                    password: 'testASD123!@#'
                })

            facultyMemberId = resLogin.body.id
            expect(resLogin).to.have.status(200)
        })
    })

    // test case to try get created faculty member's profile
    describe('Get faculty member /user', () => {
        it('should get the faculty member profile', async () => {
            const res = await chai.request(server)
                .get(`/api/facultyMember/${facultyMemberId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('faculty');

        })
    })

    // test case to amend faculty member user password
    // wip another time

    // Test case to delete faculty member user and also the profile
    describe('Delete faculty member /user', () => {
        it('should delete the faculty member user', async () => {
            const resCheck = await chai.request(server)
                .get(`/api/user/${facultyMemberId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(resCheck).to.have.status(200)

            const resDelete = await chai.request(server)
                .delete(`/api/user/${facultyMemberId} `)
                .set('Authorization', `Bearer ${adminToken} `)

            expect(resDelete).to.have.status(204)

            // check if related faculty member profile is also deleted
            const checkProfile = await chai.request(server)
                .get(`/api/facultyMember/user/${facultyMemberId} `)
                .set('Authorization', `Bearer ${adminToken} `)

            expect(checkProfile.status).to.equal(404)
        })
    })
})
