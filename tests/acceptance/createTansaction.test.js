const supertest = require('supertest');
const should = require('should');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const mongoose = require('mongoose');

const Server = require('../../server');
const { transactionModel, userModel } = require('../../database/models');
const configEnv = require('../../config.env');
const userTestModel = require('../types/userModel');

describe('POST /api/transactions', () => {
  let server;
  let token;
  const financeServer = new Server();

  before(async () => {
    server = await financeServer.startTest();
  });

  after(async () => {
    sinon.restore();
    await mongoose.connection.close();
  });

  it('Should throw 401 Unauthorized', async () => {
    await supertest(server)
      .post('/api/transactions')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(401);
  });

  context('when authorized', () => {
    const user = new userTestModel();
    token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    user.set(token);

    before(() => {
      sinon.replace(userModel, 'findById', sinon.fake.returns(user));
    });

    afterEach(() => {
      sinon.restore();
    });

    after(() => {
      sinon.restore();
    });

    it('Should throw 403 Forbidden', async () => {
      sinon.replace(
        userModel,
        'findOne',
        sinon.fake.returns({ _id: 1, token }),
      );
      await supertest(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({})
        .expect(403);
    });

    it('Should throw 400 Bad requiest', async () => {
      sinon.replace(
        userModel,
        'findOne',
        sinon.fake.returns({ _id: 1, token, familyId: 1 }),
      );
      await supertest(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400);
    });

    it('Should respond with 201 and create transaction in DB', async () => {
      const id = mongoose.Types.ObjectId();
      sinon.replace(
        userModel,
        'findOne',
        sinon.fake.returns({ _id: id, token, familyId: 1 }),
      );
      await supertest(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({ amount: '12500' })
        .expect(201);

      const { _id } = await transactionModel.findOne({ userId: id });
      should.exist(_id);
      await transactionModel.findByIdAndDelete(_id);
    });
  });
});
