require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust the path if necessary

const expect = chai.expect;
chai.use(chaiHttp);

const MONGO_URI = process.env.MONGO_URI;

describe('Database and API Tests', function() {
    this.timeout(10000); // Timeout of 10 seconds

    before((done) => {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => done())
            .catch(err => done(err));
    });

    it('should connect to MongoDB without errors', (done) => {
        expect(mongoose.connection.readyState).to.equal(1); // 1 means connected
        done();
    });

    describe('Students API', () => {

        // Test for GET all students
        it('GET all students', (done) => {
            chai.request(server)
                .get('/api/students')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        // Store student ID to be used for UPDATE and DELETE tests
        let studentId;

        // Test for POST a student (expanded to save the ID for later tests)
        it('POST a student', (done) => {
            let student = {
                name: "John Doe",
                course: "CS",
                faculty: "Infocomm Technology",
                company: "EY"
            }
            chai.request(server)
                .post('/api/students')
                .send(student)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('course');
                    res.body.should.have.property('faculty');
                    res.body.should.have.property('company');
                    studentId = res.body._id; // Store the ID from the response for later use
                    done();
                });
        });

        // Test for UPDATE a student
        it('UPDATE a student', (done) => {
            let updatedData = {
                name: "Jane Doe",
                course: "CS",
                faculty: "Infocomm Technology",
                company: "Google"
            }
            chai.request(server)
                .patch('/api/students/' + studentId)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('Jane Doe'); // Check if name has been updated
                    res.body.should.have.property('company').eql('Google'); // Check if company has been updated
                    done();
                });
        });

        // Test for DELETE a student
        it('DELETE a student', (done) => {
            chai.request(server)
                .delete('/api/students/' + studentId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').eql(studentId);
                    done();
                });
        });
    });
    after((done) => {
        mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    });
});