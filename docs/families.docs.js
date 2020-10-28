const familyEndpoints = {
  '/families': {
    post: {
      tags: ['families'],
      summary: 'Created object families in response',
      description: 'families router',
      operationId: 'postLoggedFamily',
      produces: ['application/json'],
      security: {
        type: "basic",
      },
      parameters: [
        {
          in: 'body',
          name: 'families',
          description: 'Created object family',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/FamilyCreatedRequest',
          },
        },
        {
          in: 'header',
          name: 'Authorization',
          description: 'Authorization',
          required: true,
          type: 'string',
        }
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
            $ref: '#/definitions/Family',
          },
        },
      },
    },

    put: {
      tags: ['families'],
      summary: 'Update info from family document',
      description: 'Update family',
      operationId: 'putLoggedFamily',
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'Update object family',
          description: 'Family update',
          required: true,
          type: 'string',
          schema: {
            $ref: '#/definitions/FamilyUpdateRequest',
          },
        },
        {
          in: 'header',
          name: 'Authorization',
          description: 'Authorization',
          required: true,
          type: 'string',
        }
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
          in: 'header',
          name: 'Authorization',
          description: 'Authorization',
          required: true,
          type: 'string',
        }
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
    },
  },
};

const familyDefinitions = {
  Family: {
    type: 'object',
    properties: {
      info: {
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
          totalSalary: {
            type: 'number',
          },
          passiveIncome: {
            type: 'number',
          },
          incomePercentageToSavings: {
            type: 'number',
          },
        }
      },
      gifts: {
        type: 'object',
        properties: {
          giftsUnpacked: {
            type: 'number',
          },
          giftsForUnpacking: {
            type: 'number',
          },
        }
      },
    },
    xml: {
      name: 'Family',
    },
  },

  FamilyCreatedRequest: {
    type: 'object',
    properties: {
      balance: {
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
      flatPrice: {
        type: 'number',
      },
      flatSquareMeters: {
        type: 'number',
      },
    },
    xml: {
      name: 'FamilyRequest',
    },
  },
  FamilyUpdateRequest: {
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
      name: 'FamilyUpdateRequest',
    },
  },

};

module.exports.familyEndpoints = familyEndpoints;
module.exports.familyDefinitions = familyDefinitions;