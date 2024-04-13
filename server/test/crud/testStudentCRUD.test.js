// set test environment when connecting to database
process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp)

let authToken

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

        // Login before tests run to obtain authToken
        const loginResponse = await chai.request(server)
            .post('/api/user/login')
            .send({
                email: process.env.TEST_USER_EMAIL,
                password: process.env.TEST_USER_PASSWORD
            })

        expect(loginResponse).to.have.status(200)
        authToken = loginResponse.body.token
    });

    after(async () => {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (err) {
            console.error('Error disconnecting from MongoDB', err.message);
            throw err;
        }
    });


    // Test case for GET all students
    describe('GET /student', () => {
        it('GET all students', async () => {
            const resGet = await chai.request(server)
                .get('/api/student')
                .set('Authorization', `Bearer ${authToken}`)
            expect(resGet).to.have.status(200)
            expect(resGet.body).to.be.an('array')
        })
    })


    // Test case for creating a new student
    let studentID
    describe('POST /student', () => {
        it('POST a student and save id', async () => {
            const resPOST = await chai.request(server)
                .post('/api/student')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: "John Doe",
                    course: "Mechanical Engineering",
                    faculty: "Engineering",
                    company: "Keppel"
                })

            expect(resPOST).to.have.status(200)
            expect(resPOST.body).to.be.a('object')
            expect(resPOST.body).to.include({
                name: "John Doe",
                course: "Mechanical Engineering",
                faculty: "Engineering",
                company: "Keppel"
            })
            studentID = resPOST.body._id
            console.log("studentID", studentID)
        })
    })

    // Test case for updating a student
    describe('PATCH /student', () => {
        it('UPDATE a student', async () => {
            const resPATCH = await chai.request(server)
                .patch(`/api/student/${studentID}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: "Jane Doe",
                    course: "Food Technology",
                    faculty: "Food, Chemical and Biotechnology",
                    company: "Nissin"
                })
            expect(resPATCH).to.have.status(200)
            expect(resPATCH.body).to.be.an('object')
        })

        // retrieve and check PATCH success
        it('check PATCH success', async () => {
            const resGet = await chai.request(server)
                .get(`/api/student/${studentID}`)
                .set('Authorization', `Bearer ${authToken}`)
            expect(resGet).to.have.status(200);
            expect(resGet.body).to.include({
                name: "Jane Doe",
                course: "Food Technology",
                faculty: "Food, Chemical and Biotechnology",
                company: "Nissin"
            })
        })
    })

    // Test case for deleting a student
    describe('DELETE /student', () => {
        it('DELETE a student', async () => {
            const resDEL = await chai.request(server)
                .delete(`/api/student/${studentID}`)
                .set('Authorization', `Bearer ${authToken}`)
            expect(resDEL).to.have.status(200)
            expect(resDEL.body).to.be.an('object')
            expect(resDEL.body).to.include({
                name: "Jane Doe",
                course: "Food Technology",
                faculty: "Food, Chemical and Biotechnology",
                company: "Nissin"
            })
        })
    })
})