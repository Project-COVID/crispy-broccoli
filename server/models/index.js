const mongoose = require('mongoose');
const logger = require('../logger');

module.exports = async function () {
    logger.info(`Connecting to Mongo on: ${process.env.MONGODB_URI} ...`);
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    return new Promise((resolve) => {
        mongoose.connection.on('error', (err) => logger.error(err));
        mongoose.connection.once('open', () => {
            logger.info(`Connected to Mongo on: ${process.env.MONGODB_URI}`);
            resolve();
        });
    });
};
