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
          in: 'header',
          name: 'families',
          description: 'Created object families',
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
        '201': {
          description: 'Family was created in DB successfully',
          schema: {
            $ref: '#/definitions/Families',
          },
        },
      },
    },
    put: {
      tags: ['families'],
      summary: 'Update info from family document',
      description: 'families router',
      operationId: 'putLoggedUser',
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'Credentials',
          description: 'User credentials',
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
        '201': {
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
      operationId: 'getLoggedUser',
      produces: ['application/json'],
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
        '201': {
          description: 'Family was created in DB successfully',
          schema: {
            $ref: '#/definitions/Families',
          },
        },
      },
    },
  },

};

const familyDefinitions = {
  Families: {
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
      name: 'Families',
    },
  },
  FamiliesRequest: {
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
      id: {
        type: 'string',
      },
    },
    xml: {
      name: 'Families request',
    },
  },
};

module.exports.familyEndpoints = familyEndpoints;
module.exports.familyDefinitions = familyDefinitions;