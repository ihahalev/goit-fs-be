const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const faker = require('faker');

const configEnv = require('../../config.env');
const UserModel = require('../../database/models/UserModel');

const authCheck = require('../../middlewares/auth-check');
const { ExpressReq, ExpressRes } = require('../types');
const { errorWrapper } = require('../../helpers');

describe('authCheck', () => {
  let generateReq;
  let generateRes;
  let next;
  let res;

  beforeEach(() => {
    generateReq = new ExpressReq();
    generateRes = () =>
      sinon.createStubInstance(ExpressRes, {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      });
    next = sinon.fake();
  });

  afterEach(() => sinon.restore());

  it('Missed token', async () => {
    res = generateRes();

    await errorWrapper(authCheck)(generateReq, res, next);

    sinon.assert.calledOnce(res.send);
    sinon.assert.notCalled(next);
    sinon.assert.calledWith(
      res.send,
      sinon.match({ data: { data: { message: 'Not authorized' } } }),
    );
  });

  it('Token not valid', async () => {
    res = generateRes();

    const token = jwt.sign(faker.random.word(), faker.random.word());
    generateReq.set(token);
    // sinon.replace(UserModel, 'findOne', sinon.fake.returns(null));

    await errorWrapper(authCheck)(generateReq, res, next);

    sinon.assert.calledOnce(res.send);
    sinon.assert.notCalled(next);
    sinon.assert.calledWith(
      res.send,
      sinon.match({ data: { data: { message: 'Not authorized' } } }),
    );
  });

  it('No Token in db', async () => {
    res = generateRes();

    const token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    generateReq.set(token);
    sinon.replace(UserModel, 'findOne', sinon.fake.returns(null));

    await errorWrapper(authCheck)(generateReq, res, next);

    sinon.assert.calledOnce(res.send);
    sinon.assert.notCalled(next);
    sinon.assert.calledWith(
      res.send,
      sinon.match({ data: { data: { message: 'Not authorized' } } }),
    );
  });

  it('No User in db', async () => {
    res = generateRes();

    const token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    generateReq.set(token);
    sinon.replace(UserModel, 'findOne', sinon.fake.returns({ _id: 1, token }));
    sinon.replace(UserModel, 'findById', sinon.fake.returns(null));

    await errorWrapper(authCheck)(generateReq, res, next);

    sinon.assert.calledOnce(res.send);
    sinon.assert.notCalled(next);
    sinon.assert.calledWith(
      res.send,
      sinon.match({ data: { data: { message: 'Not authorized' } } }),
    );
  });

  it('Valid Authorization', async () => {
    res = generateRes();

    const token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    sinon.replace(UserModel, 'findOne', sinon.fake.returns({ _id: 1, token }));
    sinon.replace(UserModel, 'findById', sinon.fake.returns({ _id: 1, token }));

    generateReq.set(token);
    await errorWrapper(authCheck)(generateReq, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.notCalled(res.send);
  });
});
