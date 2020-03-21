const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('./logger');
const pino = require('express-pino-logger')({
    logger,
});

const app = express();

// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
            res.redirect(`https://${req.get('Host') + req.url}`);
        } else if (req.subdomains && req.subdomains.length > 0 && req.subdomains[0] === 'beta') {
            res.redirect(`https://app.${req.hostname.slice(5)}${req.url}`);
        } else {
            next();
        }
    });
}

// Security
app.use(helmet());

// Log HTTP requests
app.use(pino);

// Set etag generation
app.set('etag', false);

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

// Handle HTTP OPTIONS
app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.sendStatus(200);
});

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

logger.info('Initializing routes');
require('./routes/index')(app);

// Fallback everything else to the React application
app.use(express.static(path.join(__dirname, '../web/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/dist/index.html'));
});

if (!process.env.PORT) {
    throw new Error('PORT environment variable not set!');
}
logger.info(`Listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);
