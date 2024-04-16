process.env.NODE_ENV = 'test'

require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const expect = chai.expect

chai.use(chaiHttp);

describe('Admin User Flow Test', function () {
    this.timeout(15000);
    let originalAdminToken;
    let adminToken;
    let adminUserId;

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
            originalAdminToken = loginResponse.body.token
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

    // Test case to create admin user
    describe('Create admin /user', () => {
        it('create an admin user', async () => {
            const resCreate = await chai.request(server)
                .post('/api/user/signup')
                .set('Authorization', `Bearer ${originalAdminToken}`)
                .send({
                    email: 'admintest@sit.edu.sg',
                    password: 'testASD123!@#',
                    role: 'admin'
                })

            // console.log('response:', resCreate.body)
            expect(resCreate).to.have.status(201)
        })
    })

    // Test case to login to the new admin user
    describe('Login admin /user', () => {
        it('login the admin user and get a token', async () => {
            const resLogin = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'admintest@sit.edu.sg',
                    password: 'testASD123!@#'
                })

            adminToken = resLogin.body.token
            adminUserId = resLogin.body.id
            expect(resLogin).to.have.status(200)
        })
    })

    // Test case to change admin password
    // describe('Patch admin /user', () => {
    //     it('patch the admin user password', async () => {
    //         const resPatch = await chai.request(server)
    //             .patch(`/api/user/${adminUserId}/role`)
    //             .set('Authorization', `Bearer ${adminToken}`)
    //             .send({
    //                 role: 'mentor'
    //             });


    //         console.log(resPatch.body)
    //         expect(resPatch).to.have.status(200)
    //         expect(resPatch.body).to.have.property('role', 'mentor')
    //     });
    // })

    describe('Delete admin /user', () => {
        it('should delete the admin user', async () => {
            const resDelete = await chai.request(server)
                .delete(`/api/user/${adminUserId}`)
                .set('Authorization', `Bearer ${originalAdminToken}`);

            expect(resDelete).to.have.status(204);
        })
    })
})
