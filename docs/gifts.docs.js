const giftsEndpoints = {
  '/gifts/unpack': {
    put: {
      tags: ['gifts'],
      summary: 'Put info',
      description: 'gifts router',
      operationId: 'giftsLoggedUser',
      produces: ['application/json'],
      parameters: [
        {
          in: 'Authorization header',
          name: '',
          description: 'gifts',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/Gifts',
          },
        },
      ],
      responses: {
        '401': {
          description: 'user not authorized',
        },
        '403': {
          description: 'user not a member of family',
        },
        '200': {
          description: 'decrement giftsForUnpacking & increment giftsUnpacked values',
        },
      },
    },
  },
};

const giftsDefinitions = {
  Gifts: {
    type: 'object',
    properties: {
      giftsForUnpacking: {
        type: 'number',
      },
    },
    xml: {
      name: 'Gifts',
    },
  },

};

exports.giftsEndpoints = giftsEndpoints;
exports.giftsDefinitions = giftsDefinitions;