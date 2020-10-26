const faker = require("faker");
const jwt = require("jsonwebtoken");
const config = require("../../config.env");
const { ApiError } = require("../../helpers");

const request = require("supertest");
const { FamilieModel, UserModel } = require("../../database/modules");
const UserServer = require("../../server");

// const authCeck = require('../../middlewares/auth-check');

// jest.mock('../../database/models/UserModel')
// jest.mock('../../helpers/get-logger.js')

const findOneSpy = jest.spyOn(UserModel, "findOne");
const res = {
  send: jest.fn(),
  status: jest.fn().mockReturnThis()
};

describe("Acceptance tests suitcase example", () => {
  let server;

  beforeAll(async () => {
    const userServer = new UserServer();
    server = await userServer.start();

    findOneSpy.mockClear();
    res.send.mockClear();
    res.status.mockClear();
  });

  afterAll(() => {
    server.close();
    findOneSpy.mockRestore();
  });


  test("Should throw 400 if request validation failed", async () => {

    await request(server)
      .post('/api/families')
      .set("Conent-type", "application/json")
      .send({})
      .expect(400);

  });



  test('Should respond with 201 if family was created in DB successfully', async () => {

    const token = jwt.sign(faker.random.word(), config.sectetKey);
    beforeEach(async () => {

      const tokens = [{ token, expires: new Date(new Date().getTime() * 1e3) }];

      const req = {
        headers: { "access-token": token }
      };
      const next = jest.fn();

      findOneSpy.mockResolvedValue({ _id: 1, tokens });

      await authCheck(req, res, next);
    });

    afterEach(async () => {
      await FamilieModel.deleteMany();
    });

    const response = await request(server)
      .post('/api/families')
      .set('Content-Type', 'application/json')
      .set("access-token", token)
      .send({
        totalSalary: 1000,
        passiveIncome: 10,
        incomePercentageToSavings: 100,
        balance: 100,
        flatPrice: 200,
        flatSquareMeters: 200
      })
      .expect(201);

    const responseBody = response.body;

    should.exists(responseBody);
    responseBody.should.have.property('id').which.is.a.String();
    // responseBody.should.not.have.property('password');

    const createdUser = await FamilieModel.findById(responseBody.id);
    should.exists(createdUser);

  });
});