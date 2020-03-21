const express = require('express');

const Response = require('../response');

module.exports = function() {
    const router = express.Router();
    router.route('/').get((req, res) => {
        req.log.info('Hello, world!');
        return Response.OK({ hello: 'world' }).send(res);
    });

    return router;
};
