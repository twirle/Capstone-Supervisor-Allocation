// set test environment when connecting to database
process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp)

let adminToken
let studentId
let facultyId
let facultyIdNew
let courses
let courseNew

describe('Student CRUD Flow Test', function () {
    this.timeout(15000);

    before(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB for testing');
        } catch (err) {
            console.error('Database connection error', err.message)
            throw err
        }
        try {
            // admin login to obtain authtoken
            const loginResponse = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: process.env.TEST_USER_EMAIL,
                    password: process.env.TEST_USER_PASSWORD
                })

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
            facultyIdNew = facultyResponse.body[1]._id

            courses = faculty.courses

            console.log('facultyID:', facultyId)
            console.log('faculty name:', faculty.name)
            console.log('faculty courses:', courses)

            course = courses[0]
            courseNew = courses[1]

        } catch (err) {
            console.error('Failed to fetch faculty', err.message);
            throw err;
        }
    })

    after(async () => {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (err) {
            console.error('Error disconnecting from MongoDB', err.message);
            throw err;
        }
    });

    // Test case to create student user
    describe('Create student /user', () => {
        it('should create a student user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'studenttest@sit.edu.sg',
                    password: process.env.TEST_USER_PASSWORD,
                    role: 'student',
                    additionalInfo: {
                        name: 'Test Student',
                        faculty: facultyId,
                        course: course,
                        company: 'Nestle'
                    }
                })

            if (resCreate.status !== 201) {
                console.error('Failed to create mentor user:', resCreate.body)
            }
            expect(resCreate).to.have.status(201)
            studentId = resCreate.body.user._id
        })
    })


    // Test case for GET all students
    describe('get all students /api/student', () => {
        it('should get all students', async () => {
            const resGet = await chai.request(server)
                .get('/api/student')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(resGet).to.have.status(200)
            expect(resGet.body).to.be.an('array')
        })
    })

    // test case to try get created student's profile
    describe('Get student /user', () => {
        it('should get the student profile', async () => {
            const res = await chai.request(server)
                .get(`/api/student/${studentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('name')
            expect(res.body).to.have.property('faculty')
        })
    })

    // Test case for updating a student
    describe('Update student /api/student/:id', () => {
        it('should update the student', async () => {
            const resUpdate = await chai.request(server)
                .patch(`/api/student/${studentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: "updated student name",
                    course: courseNew,
                    faculty: facultyIdNew,
                    company: "Nissin"
                })
            expect(resUpdate).to.have.status(200)
        })
    })

    // Test case for deleting a student and profile
    describe('DELETE student /user', () => {
        it('delete student user and ensure profile is also deleted', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${studentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(resDelete).to.have.status(204)

            // check if related mentor profile is also successfully deleted
            const checkProfile = await chai.request(server)
                .get(`/api/mentor/${studentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(checkProfile.status).to.equal(404)
        })
    })
})