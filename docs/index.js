const { swagger } = require('../config.env');
const { familyDefinitions, familyEndpoints } = require('./families.docs');
const { giftsDefinitions, giftsEndpoints } = require('./gifts.docs');

module.exports = {
  swagger: '2.0',
  info: {
    description: '',
    version: '1.0.0',
    title: 'Docs',
    contact: {
      email: '',
    },
  },
  host: '',
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
