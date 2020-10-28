const { swagger } = require('../config.env');
const { familyDefinitions, familyEndpoints } = require('./families.docs');
const { giftsDefinitions, giftsEndpoints } = require('./gifts.docs');

// const test = require('./swagger.json');
// module.exports = test;

module.exports = {
  swagger: '2.0',
  info: {
    description: '',
    version: '1.0.0',
    title: 'Wallet Docs',
    contact: {
      email: '',
    },
  },
  host: swagger.host,
  basePath: '/api',
  tags: [
    {
      name: 'example',
      description: 'example router',
    },
  ],
  schemes: swagger.schemes,
  paths: {
    ...familyEndpoints,
    ...giftsEndpoints,
  },
  definitions: {
    ...familyDefinitions,
    ...giftsDefinitions,
  },
};
