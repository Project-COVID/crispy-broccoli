const express = require('express');
const Joi = require('joi');

const Response = require('../response');

module.exports = function() {
    const router = express.Router();
    router.route('/').get(async (req, res) => {
        try {
            await Joi.validate(req.query, {
                foo: Joi.string()
                    .valid(['bar'])
                    .required(),
            });
            // TODO call controller code here
            req.log.info('Hello, world!');
            return Response.OK({ hello: 'world' }).send(res);
        } catch (err) {
            if (err.isJoi) {
                return Response.BadRequest(err.details).send(res);
            }
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    return router;
};
