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
    let adminToken;
    let facultyId;

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
                .get('/api/faculty') // Adjust this endpoint as necessary
                .set('Authorization', `Bearer ${adminToken}`);

            expect(facultyResponse).to.have.status(200);
            expect(facultyResponse.body).to.be.an('array').that.is.not.empty;
            facultyId = facultyResponse.body[0]._id; // Use the ID of the first faculty
            console.log('facultyID:', facultyId)
            console.log('faculty name:', facultyResponse.body[0].name)

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

    // Test case to create a mentor
    describe('Create mentor /api/mentor', () => {
        it('should create a new mentor', async () => {
            const resCreate = await chai.request(server)
                .post('/api/mentor')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'test mentor',
                    faculty: facultyId,
                    researchArea: 'test research area'

                });

            expect(resCreate).to.have.status(201);
            mentorId = resCreate.body._id; // Assuming the response body will contain the faculty id
        });
    });

    // Test case to get all mentors
    describe('Get all mentor /api/mentor', () => {
        it('should get all mentors', async () => {
            const resGetAll = await chai.request(server)
                .get('/api/mentor')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resGetAll).to.have.status(200);
            expect(resGetAll.body.length).to.be.greaterThan(0);
        });
    });

    // Test case to update a mentor
    describe('Update mentor /api/mentor/:id', () => {
        it('should update the mentor', async () => {
            const resUpdate = await chai.request(server)
                .patch(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'updated mentor name',
                    faculty: '',
                    researchArea: 'test research area'
                });

            expect(resUpdate).to.have.status(200);
        });
    });

    // Test case to delete a mentor
    describe('Delete faculty /api/mentor/:id', () => {
        it('should delete the mentor', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/mentor/${mentorId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(200);
        });
    });
});
