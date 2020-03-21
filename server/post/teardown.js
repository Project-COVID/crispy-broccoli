const Joi = require('joi');
const Response = require('../response');

function doSomething(req) {
    req.log.info('Teardown post!', req.query);
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.query, /* TODO add schema */ {});

        // TODO call controller code here
        doSomething(req);

        return Response.OK({ hello: 'world' });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
