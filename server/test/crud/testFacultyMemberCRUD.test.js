process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server') // Adjust the path as necessary
const expect = chai.expect

chai.use(chaiHttp);


describe('Faculty CRUD Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let facultyMemberId
    let facultyId
    let facultyIdNew


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
            facultyNew = facultyResponse.body[1]
            facultyId = faculty._id
            facultyIdNew = facultyNew._id

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

    // Test case to create a faculty member
    describe('Create facultymember /user', () => {
        it('should create an facultymember user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'facultymembertest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'facultyMember',
                    additionalInfo: {
                        name: 'Test faculty member',
                        faculty: facultyId
                    }
                })
            if (resCreate.status !== 201) {
                console.error('Failed to create mentor user:', resCreate.body)
            }
            expect(resCreate).to.have.status(201);
            facultyId = resCreate.body._id; // Assuming the response body will contain the faculty id
        })
    })

    // Test case to get all faculty members
    describe('Get all faculty members /api/facultyMember', () => {
        it('should get all faculty members', async () => {
            const resGetAll = await chai.request(server)
                .get('/api/facultyMember')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resGetAll).to.have.status(200);
            expect(resGetAll.body.length).to.be.greaterThan(0);
        })
    })

    // Test case to update a faculty member
    describe('Update faculty /api/facultyMember/:id', () => {
        it('should update the faculty member', async () => {
            const resUpdate = await chai.request(server)
                .patch(`/api/facultyMember/${facultyMemberId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Test Faculty Member',
                    faculty: facultyIdNew
                });
            console.log('Updated', resUpdate.body)
            expect(resUpdate).to.have.status(200);
        });
    });

    // Test case to delete a faculty member and profile
    describe('Delete faculty user', () => {
        it('should delete the faculty member', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${facultyMemberId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(200);

            // Check if the related faculty member profile is also deleted
            const checkProfile = await chai.request(server)
                .get(`/api/facultyMember/user/${facultyMemberId}`)
                .set('Authorization', `Bearer ${adminToken}`)

            console.log('checkprofile body:', checkProfile.body)
            expect(checkProfile.status).to.equal(404)
        })
    })
})
