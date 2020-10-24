const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const configEnv = require('./config.env');
const { userRouter } = require('./routers');

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
  }

  initRoutes() {
    this.server.use('/', () => {
      throw new ApiError(404, 'Not found', {
        message: 'Not authorized',
      });
    }); //express.static(path.join(__dirname, 'public')));
    this.server.use('api/users', userRouter);
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
