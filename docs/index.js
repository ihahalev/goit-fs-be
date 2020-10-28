const { swagger } = require('../config.env');
const { familyDefinitions, familyEndpoints } = require('./families.docs');
const { giftsDefinitions, giftsEndpoints } = require('./gifts.docs');

// const test = require('./swagger.json');
// module.exports = test;

module.exports = {
  // openapi: '3.0.2',
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
      name: 'families',
      description: 'families router',
    },
    {
      name: 'gifts',
      description: 'gifts router',
    },
  ],
  schemes: swagger.schemes,
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
      flow: 'implicit',
      scopes: [{}]
    },
    api_key: { type: 'apiKey', name: 'api_key', in: 'header' }
  },
  paths: {
    ...familyEndpoints,
    ...giftsEndpoints,
  },
  definitions: {
    ...familyDefinitions,
    ...giftsDefinitions,
  },
};
