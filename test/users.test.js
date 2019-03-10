// During the test the env variable is set to test
process.env.app_env = 'test';

const chaiHttp = require('chai-http');
const chai = require('chai');
const User = require('../models/user');

const server = require('../app');

const should = chai.should();


chai.use(chaiHttp);

describe('User routes test', () => {
    const user = {
        emailId: 'test@gmail.com',
        password: 'test',
    };

    before((done) => { // Before each test we empty the database
        User.remove({}, (err) => {
            if (!err) {
                done();
            }
        });
    });

    /**
     * Test the POST /api/user
     */
    it('it should create a user', (done) => {
        chai.request(server)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });

    /**
     * Test the POST /api/user
     */
    it('it should return duplicate user error', (done) => {
        chai.request(server)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('failed');
                done();
            });
    });

    /**
     * Test the POST /api/user/authenticate
     */
    it('it should return jwt token with successful login message', (done) => {
        chai.request(server)
            .post('/api/user/authenticate')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });

    /**
     * Test the POST /api/user/authenticate
     */
    it('it should return user not found 404 error message', (done) => {
        const invalidUser = {
            emailId: 'notfound@gmail.com',
            password: 'dummy',
        };
        chai.request(server)
            .post('/api/user/authenticate')
            .send(invalidUser)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('failed');
                done();
            });
    });
});
