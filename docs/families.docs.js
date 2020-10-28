const familyEndpoints = {
  '/families': {
    post: {
      tags: ['families'],
      summary: 'Created object families in response',
      description: 'families router',
      operationId: 'postLoggedUser',
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'families',
          header: 'authorization',
          description: 'Created object families. Token required',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/FamiliesRequest',
          },
        },
      ],
      responses: {
        '400': {
          description: 'Request body format is invalid',
        },
        '401': {
          description: 'User not authorized',
        },
        '409': {
          description: 'User already created family/is a part of family',
        },
        '200': {
          description: 'Family was created in DB successfully',
          schema: {
            $ref: '#/definitions/Families',
          },
        },
      },
    },
    put: {
      tags: ['families'],
      summary: 'Update info from family document with authorization header',
      description: '',
      operationId: 'putLoggedUser',
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'Put family',
          header: 'authorization',
          description: 'Family update',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/Families',
          },
        },
      ],
      responses: {
        '400': {
          description: 'User request body format is invalid',
        },
        '401': {
          description: 'User not authorized',
        },
        '409': {
          description: 'User already created family / is a part of family',
        },
        '200': {
          description: 'Family was created in DB successfully',
          schema: {
            $ref: '#/definitions/Families',
          },
        },
      },
    },
  },

  '/families/current': {
    get: {
      tags: ['families'],
      summary: 'Get info from family document',
      description: 'families router',
      header: 'authorization',
      operationId: 'getLoggedUser',
      produces: ['application/json'],
      responses: {
        '401': {
          description: 'User not authorized',
        },
        '404': {
          description: 'family not found for that user',
        },
        '200': {
          description: 'All info from family document',
          schema: {
            $ref: '#/definitions/Family',
          },
        },
      },
    },
  },

};

const familyDefinitions = {
  Family: {
    type: 'object',
    properties: {
      balance: {
        type: 'number',
      },
      flatPrice: {
        type: 'number',
      },
      flatSquareMeters: {
        type: 'number',
      },
      giftsUnpacked: {
        type: 'number',
      },
      giftsForUnpacking: {
        type: 'number',
      },
      totalSalary: {
        type: 'number',
      },
      passiveIncome: {
        type: 'number',
      },
      incomePercentageToSavings: {
        type: 'number',
      },
      id: {
        type: 'string',
      }

    },
    xml: {
      name: 'Family',
    },
  },
  FamilyRequest: {
    type: 'object',
    properties: {
      totalSalary: {
        type: 'number',
      },
      passiveIncome: {
        type: 'number',
      },
      incomePercentageToSavings: {
        type: 'number',
      },
      flatPrice: {
        type: 'number',
      },
      flatSquareMeters: {
        type: 'number',
      },
    },
    xml: {
      name: 'Family request',
    },
  },
};

module.exports.familyEndpoints = familyEndpoints;
module.exports.familyDefinitions = familyDefinitions;