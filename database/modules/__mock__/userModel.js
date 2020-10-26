module.exports = jest.fn().mockImplementation(() => ({
  findOne: jest.fn(),
  find: jest.fn()
}));