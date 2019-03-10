// During the test the env variable is set to test
process.env.app_env = 'test';

const chaiHttp = require('chai-http');
const chai = require('chai');
const Product = require('../models/product');

const server = require('../app');

const should = chai.should();


chai.use(chaiHttp);

describe('Product routes test', () => {
    const product = {
        brand: 'xyz',
        sizeRange: '6-9',
        price: '99.99',
        batchId: 765444,
        stock: 56,
        manufacturingYear: '2018',
    };
    const user = {
        emailId: 'test@gmail.com',
        password: 'test',
    };

    before((done) => { // Before test we empty the database
        Product.remove({}, (err) => {
            if (!err) {
                done();
            }
        });
    });

    let token = '';

    beforeEach((done) => { // Before test we get the jwt token
        chai.request(server)
            .post('/api/user/authenticate')
            .send(user)
            .end((err, res) => {
                console.log(res.body.token);
                // eslint-disable-next-line
                token = res.body.token;
                done();
            });
    });

    /**
     * Test the POST /api/product
     */
    it('it should create a product', (done) => {
        console.log(`token: ${token}`);
        chai.request(server)
            .post('/api/product')
            .set('Authorization', `JWT ${token}`)
            .send(product)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });

    /**
     * Test the POST /api/product
     */
    it('it should fail with 401', (done) => {
        console.log(`token: ${token}`);
        chai.request(server)
            .post('/api/product')
            .set('Authorization', 'JWT invalid-token')
            .send(product)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});
