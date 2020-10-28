const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const configEnv = require('./config.env');
const { usersRouter, familiesRouter, giftsRouter, transactionsRouter } = require('./routers');

const { mailer, getLogger } = require('./helpers');
const connection = require('./database/Connection');

const logger = getLogger('Server');
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

  async close() {
    return connection.close;
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
    this.server.use('/', express.static(path.join(__dirname, 'public')));
    this.server.use('/api/users', usersRouter);
    this.server.use('/api/transactions', transactionsRouter);
    this.server.use('/api/families', familiesRouter);
    this.server.use('/api/gifts', giftsRouter);
  }

  startListening() {
    return this.server.listen(configEnv.port, (err) => {
      if (err) {
        return logger.error(err);
      }

      logger.info('server started at port', configEnv.port);
    });
  }
};
