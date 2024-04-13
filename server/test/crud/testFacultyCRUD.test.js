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
    let adminToken;
    let facultyId;

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

    // Test case to create a faculty
    describe('Create faculty /api/faculty', () => {
        it('should create a new faculty', async () => {
            const resCreate = await chai.request(server)
                .post('/api/faculty')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Faculty',
                    courses: ['Test Course 1', 'Test Course 2']
                });

            expect(resCreate).to.have.status(201);
            facultyId = resCreate.body._id; // Assuming the response body will contain the faculty id
        });
    });

    // Test case to get all faculties
    describe('Get all faculties /api/faculty', () => {
        it('should get all faculties', async () => {
            const resGetAll = await chai.request(server)
                .get('/api/faculty')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resGetAll).to.have.status(200);
            expect(resGetAll.body.length).to.be.greaterThan(0);
        });
    });

    // Test case to update a faculty
    describe('Update faculty /api/faculty/:id', () => {
        it('should update the faculty', async () => {
            const resUpdate = await chai.request(server)
                .patch(`/api/faculty/${facultyId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Test Faculty',
                    courses: ['Updated Course 1']
                });

            expect(resUpdate).to.have.status(200);
        });
    });

    // Test case to get a single faculty by ID
    describe('Get single faculty /api/faculty/:id', () => {
        it('should retrieve a single faculty by id', async () => {
            const res = await chai.request(server)
                .get(`/api/faculty/${facultyId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal(facultyId);
            expect(res.body.name).to.equal('Updated Test Faculty'); // Ensure the name matches the updated name
            expect(res.body.courses).to.deep.equal(['Updated Course 1']); // Verify the updated courses array
        });

        it('should return a 404 for a non-existent faculty ID', async () => {
            const nonExistentFacultyId = "5f8d0d55b54764421b715b61"; // Example non-existent ID

            const res = await chai.request(server)
                .get(`/api/faculty/${nonExistentFacultyId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res).to.have.status(404);
        });
    });

    // Test case to delete a faculty
    describe('Delete faculty /api/faculty/:id', () => {
        it('should delete the faculty', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/faculty/${facultyId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(200);
        });
    });
});
