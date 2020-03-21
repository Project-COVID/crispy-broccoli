module.exports = require('pino')({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
});
