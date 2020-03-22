const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');

async function getPost(req, postType) {
    req.log.info('Get post!', req.query);

    // Return the 10 most recent posts for the given type
    try {
        return await Post.find({
            type: postType,
            verified: true
        }).sort({
            createdAt: -1
        }).limit(10);
    } catch(err) {
        throw err; 
    }
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.query, /* TODO add schema */ {});

        let offersList = await getPost(req, 'offer');
        let requestsList = await getPost(req, 'request');

        return Response.OK({offers: offersList, requests: requestsList});
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
