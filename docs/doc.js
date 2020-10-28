module.export = {
  swagger: '2.0',
  info: {
    description: 'This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
    version: '1.0.0',
    title: 'Swagger Petstore',
    termsOfService: 'http://swagger.io/terms/',
    contact: { email: 'apiteam@swagger.io' },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  host: 'petstore.swagger.io',
  basePath: '/v2',
  tags: [
    {
      name: 'get',
      description: 'Everything about your Pets',
      externalDocs: [Object]
    },
    { name: 'store', description: 'Access to Petstore orders' },
    {
      name: 'user',
      description: 'Operations about user',
      externalDocs: [Object]
    }
  ],
  schemes: ['https', 'http'],
  paths: {
    '/get': { post: [Object], put: [Object] },
    '/pet/findByStatus': { get: [Object] },
    '/pet/findByTags': { get: [Object] },
    '/pet/{petId}': { get: [Object], post: [Object], delete: [Object] },
    '/pet/{petId}/uploadImage': { post: [Object] },
    '/store/inventory': { get: [Object] },
    '/store/order': { post: [Object] },
    '/store/order/{orderId}': { get: [Object], delete: [Object] },
    '/user': { post: [Object] },
    '/user/createWithArray': { post: [Object] },
    '/user/createWithList': { post: [Object] },
    '/user/login': { get: [Object] },
    '/user/logout': { get: [Object] },
    '/user/{username}': { get: [Object], put: [Object], delete: [Object] }
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
      flow: 'implicit',
      scopes: [Object]
    },
    api_key: { type: 'apiKey', name: 'api_key', in: 'header' }
  },
  definitions: {
    Order: { type: 'object', properties: [Object], xml: [Object] },
    Category: { type: 'object', properties: [Object], xml: [Object] },
    User: { type: 'object', properties: [Object], xml: [Object] },
    Tag: { type: 'object', properties: [Object], xml: [Object] },
    Pet: {
      type: 'object',
      required: [Array],
      properties: [Object],
      xml: [Object]
    },
    ApiResponse: { type: 'object', properties: [Object] }
    api_key: { type: 'apiKey', name: 'api_key', in: 'header' }
  },
  definitions: {
    Order: { type: 'object', properties: [Object], xml: [Object] },
    Category: { type: 'object', properties: [Object], xml: [Object] },
    User: { type: 'object', properties: [Object], xml: [Object] },
    Tag: { type: 'object', properties: [Object], xml: [Object] },
    Pet: {
      type: 'object',
      required: [Array],
      properties: [Object],
      xml: [Object]
    },
    ApiResponse: { type: 'object', properties: [Object] }
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  }
}