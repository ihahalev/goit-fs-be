const supertest = require('supertest');
const should = require('should');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const faker = require('faker');

const Server = require('../../server');
const TransactionModel = require('../../database/models/TransactionModel');
const UserModel = require('../../database/models/UserModel');
const configEnv = require('../../config.env');
const userModel = require('../types/userModel');

describe('GET /api/transactions/categories', () => {
  let server;
  let token;

  before(async () => {
    const financeServer = new Server();
    server = await financeServer.start().catch(console.error);
  });

  after(async () => {
    sinon.restore();
    await server.close();
    // process.exit(0);
  });

  it('Should throw 401 Unauthorized', async () => {
    await supertest(server)
      .get('/api/transactions/categories')
      .set('Content-Type', 'application/json')
      .expect(401);
  });

  context('when authorized', () => {
    const user = new userModel();
    token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    user.set(token);

    before(() => {
      sinon.replace(UserModel, 'findById', sinon.fake.returns(user));
    });

    afterEach(() => {
      sinon.restore();
    });

    after(() => {
      sinon.restore();
    });

    it('Should respond with 200 and categories array', async () => {
      sinon.replace(
        UserModel,
        'findOne',
        sinon.fake.returns({ _id: 1, token, familyId: 1 }),
      );
      const res = await supertest(server)
        .get('/api/transactions/categories')
        .set('Content-Type', 'application/json')
        .expect(200);

      should.exist(res.body);
      res.body.should.have.property('transactionCategories').which.is.a.Array();
    });
  });
});
