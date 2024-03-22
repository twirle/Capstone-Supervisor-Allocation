// set test environment when connecting to database
process.env.NODE_ENV = 'test';

// Import the necessary modules
require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect;

// Use chaiHttp for HTTP requests
chai.use(chaiHttp)

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY2NjM2ODk5YTg1NWIxMjhiODI2YmUiLCJpYXQiOjE3MTAwNjkyNTksImV4cCI6MTcxMDMyODQ1OX0.akrNnoYgpyHEkHKLPso2YoYNYG_YlfSu2POPPCu_HaA'


// Assumes that server is already running.

// Test suite
describe('Database and API Tests', function () {
    // Increase the timeout if the database connection takes longer
    this.timeout(15000)

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
    });

    // After hook to close the database connection
    after(async () => {
        try {
            await mongoose.disconnect()
            console.log('Disconnected from MongoDB')
        } catch (err) {
            console.error('Error disconnecting from MongoDB', err.message)
            throw err
        }
    })


    // Test case for GET all students
    describe('GET /students', () => {
        it('GET all students', async () => { // Using async here
            const resGet = await chai.request(server)
                .get('/api/students')
                .set('Authorization', `Bearer ${authToken}`)
            expect(resGet).to.have.status(200)
            expect(resGet.body).to.be.an('array')
        })
    })


    // Test case for creating a new student
    let studentID
    describe('POST /students', () => {
        it('POST a student and save id', async () => {
            const resPOST = await chai.request(server)
                .post('/api/students')
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
    describe('PATCH /students', () => {
        it('UPDATE a student', async () => {
            const resPATCH = await chai.request(server)
                .patch(`/api/students/${studentID}`)
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
                .get(`/api/students/${studentID}`)
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
    describe('DELETE /students', () => {
        it('DELETE a student', async () => {
            const resDEL = await chai.request(server)
                .delete(`/api/students/${studentID}`)
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
