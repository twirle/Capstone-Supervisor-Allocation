process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server') // Adjust the path as necessary
const expect = chai.expect

chai.use(chaiHttp);

describe('Mentor CRUD Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let mentorId
    let faculty
    let facultyId
    let facultyIdNew
    let researchArea
    let researchAreaNew

    before(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log('Connected to MongoDB for testing');
        } catch (err) {
            console.error('Database connection error', err.message);
            throw err
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
            facultyNew = facultyResponse.body[1]
            facultyId = faculty._id
            facultyIdNew = facultyNew._id
            courses = faculty.courses
            coursesNew = facultyNew.courses

            researchArea = courses[0]
            researchAreaNew = coursesNew[0]

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
    // Test case to create mentor user
    describe('Create mentor /user', () => {
        it('should create an mentor user', async () => {
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
            mentorId = resCreate.body.user._id
        })
    })

    // Test case to get all mentors
    describe('Get all mentor /api/mentor', () => {
        it('should get all mentors', async () => {
            const resGetAll = await chai.request(server)
                .get('/api/mentor')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(resGetAll).to.have.status(200);
            expect(resGetAll.body.length).to.be.greaterThan(0);
        })
    })

    // Test case to get the created mentor profile
    describe('Get the created mentor /user', () => {
        it('should get the created mentor profile', async () => {
            const res = await chai.request(server)
                .get(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('faculty');
        })
    })

    // Test case to update a mentor
    describe('Update mentor /api/mentor/:id', () => {
        it('should update the mentor', async () => {
            const resUpdate = await chai.request(server)
                .patch(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'updated mentor name',
                    faculty: facultyIdNew,
                    researchArea: researchAreaNew
                })
            expect(resUpdate).to.have.status(200);
        })
    })

    // Test case to delete mentor user and profile
    describe('Delete mentor /user', () => {
        it('delete the mentor user and ensure profile is also deleted', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(resDelete).to.have.status(204);

            // Check if the related mentor profile is also deleted
            const checkProfile = await chai.request(server)
                .get(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(checkProfile.status).to.equal(404)
        })
    })
})