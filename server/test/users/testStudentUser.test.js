process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp);

describe('Student User Flow Test', function () {
    this.timeout(15000);
    let adminToken
    let studentUserId

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

    // Test case to create student user
    describe('Create student /user', () => {
        it('create an student user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'studenttest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'student',
                    additionalInfo: {
                        name: 'Test Student',
                        faculty: 'Infocomm Technology',
                        course: 'Computer Engineering',
                        company: 'Amazon'
                    }
                })

            // console.log('response:', resCreate.body)
            expect(resCreate).to.have.status(201)
        })
    })

    // Test case to login to the new student user
    describe('Login student /user', () => {
        it('login the student user and get a token', async () => {
            const resLogin = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'studenttest@sit.edu.sg',
                    password: 'testASD123!@#'
                })

            studentUserId = resLogin.body.id
            expect(resLogin).to.have.status(200)
        })
    })

    describe('Patch student /user', () => {
        it('patch the student user role', async () => {
            const resPatch = await chai.request(server)
                .patch(`/api/user/${studentUserId}/role`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    role: 'mentor'
                });


            // console.log(resPatch.body)
            expect(resPatch).to.have.status(200)
            expect(resPatch.body).to.have.property('role', 'mentor')
        });
    })

    describe('Delete student /user', () => {
        it('delete the student user', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${studentUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(resDelete).to.have.status(200);
        })
    })
})
