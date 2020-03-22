const Joi = require('joi');
const Response = require('../response');
const mongoose = require('mongoose');
const Post = require('../models/post');

function getPost(req) {
    req.log.info('Get post!', req.query);

    // no params - 10 latest for each cat
    // with lat&long params - 10 latest within 5km radius of that lat/lon
    return Post.find();
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.query, /* TODO add schema */ {});

        // TODO call controller code here
        res = getPost(req);
        console.log(res);

        return Response.OK({ hello: 'world' });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
