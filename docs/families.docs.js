const familyEndpoints = {
  '/families': {
    post: {
      tags: ['families'],
      summary: 'Created object families in response',
      description: 'families router',
      operationId: 'postLoggedFamily',
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'families',
          description: 'Created object families. Token required',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/FamilyRequest',
          },
          in: 'header',
          name: 'Authorization',
          description: 'Authorization',
          required: true,
          type: 'string',
        },
      ],
      security: {
        token: {
          type: 'apiKey',
          name: 'api_key',
          in: 'header'
        }
      },
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
            $ref: '#/definitions/Family',
          },
        },
      },
      // security: {
      //   api_key: {
      //     type: 'apiKey',
      //     name: 'api_key',
      //     in: 'header'
      //   }
      // }
    },

    put: {
      tags: ['families'],
      summary: 'Update info from family document with authorization header',
      description: '',
      operationId: 'putLoggedFamily',
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
            $ref: '#/definitions/Family',
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
            $ref: '#/definitions/Family',
          },
        },
      },
      security: {
        api_key: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      },
    },
  },

  '/families/current': {
    get: {
      tags: ['families'],
      summary: 'Get info from family document',
      description: 'families router',
      operationId: 'getLoggedFamily',
      produces: ['application/json'],
      parameters: [
        {
          in: 'authorization',
          name: 'Bearer Token',
          description: 'Bearer Token',
          required: true,
          type: 'string',
        },
      ],
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

      security: {
        api_key: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
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