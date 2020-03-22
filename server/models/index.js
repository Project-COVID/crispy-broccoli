const mongoose = require('mongoose');
const logger = require('../logger');

module.exports = async function() {
    logger.info(`Connecting to Mongo on: ${process.env.MONGO_CONN} ...`);
    mongoose.connect(process.env.MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true });
    return new Promise(resolve => {
        mongoose.connection.on('error', err => logger.error(err));
        mongoose.connection.once('open', () => {
            logger.info(`Connected to Mongo on: ${process.env.MONGO_CONN}`);
            resolve();
        });
    });
};
