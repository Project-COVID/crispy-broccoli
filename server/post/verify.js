const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');

async function verifyPost(id, hash) {
    const post = await Post.findById(id);
    if (post.verifyHash === hash) {
        post.verified = true;
        await post.save();
        return true;
    }
    return false;
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.query, {
            verifyHash: Joi.string()
                .guid({
                    version: ['uuidv4'],
                })
                .min(1)
                .required(),
        });

        const success = await verifyPost(req.params.id, req.query.verifyHash);
        if (!success) {
            return Response.Forbidden({
                message: 'failed to verify post',
            });
        }
        return Response.OK();
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
