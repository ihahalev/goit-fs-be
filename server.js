const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const configEnv = require('./config.env');
const { usersRouter } = require('./routers');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/index');

const { familiesRouter, giftsRoutrer } = require('./routers');

const { mailer, ApiError } = require('./helpers');
const connection = require('./database/Connection');

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    await mailer.init();
    await connection.connect();
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    const retListen = this.startListening();
    process.on('SIGILL', () => {
      connection.close();
    });
    return retListen;
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(morgan('tiny'));
    this.server.use(express.json());
    this.server.use(cors({ origin: configEnv.allowedOrigin }));
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  initRoutes() {

    this.server.use('/', express.static(path.join(__dirname, 'public')));
    // this.server.use('/api/contacts', contactsRouter);
    // this.server.use('/api/users', userRouter);
    // this.server.use('/api/auth', authRouter);

    this.server.use('/api/families', familiesRouter);
    this.server.use('/api/gifts', giftsRoutrer);
    this.server.use('/api/users', usersRouter);
  }

  startListening() {
    return this.server.listen(configEnv.port, (err) => {
      if (err) {
        return console.error(err);
      }

      console.info('server started at port', configEnv.port);
    });
  }
};
