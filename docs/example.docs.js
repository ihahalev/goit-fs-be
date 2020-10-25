const exampleEndpoints = {
  '/examples': {
    get: {
      tags: ['example'],
      summary: 'Get hello string in response',
      description: '',
      operationId: 'getExample',
      produces: ['application/json'],
      responses: {
        '404': {
          description: 'example not found',
        },
        '200': {
          description: 'Successfull with example entity',
          schema: {
            $ref: '#/definitions/Example',
          },
        },
      },
    },
    post: {
      tags: ['example'],
      summary: 'Create hello string in response',
      description: '',
      operationId: 'getExample',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'example',
          description: 'Example object that needs to be created',
          required: true,
          schema: {
            $ref: '#/definitions/ExampleRequest',
          },
        },
      ],
      responses: {
        '404': {
          description: 'example not found',
        },
        '200': {
          description: 'Successfull with example entity',
          schema: {
            $ref: '#/definitions/Example',
          },
        },
      },
    },
  },
};

const exampleDefinitions = {
  Example: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      textField: {
        type: 'string',
      },
    },
    xml: {
      name: 'Example',
    },
  },
  ExampleRequest: {
    type: 'object',
    properties: {
      textField: {
        type: 'string',
      },
    },
    xml: {
      name: 'Example',
    },
  },
};

exports.exampleEndpoints = exampleEndpoints;
exports.exampleDefinitions = exampleDefinitions;

