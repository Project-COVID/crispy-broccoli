const Joi = require('joi');
const Post = require('../models/post');
const Response = require('../response');

async function teardownPost(id, hash) {
    const post = await Post.findById(id);
    if (post.teardownHash === hash) {
        post.status = 'closed';
        post.updated = new Date();
        await post.save();
        return true;
    }
    return false;
}

module.exports = async function (req) {
    try {
        await Joi.validate(req.query, {
            teardownHash: Joi.string()
                .guid({
                    version: ['uuidv4'],
                })
                .min(1)
                .required(),
        });

        const success = await teardownPost(req.params.id, req.query.teardownHash);
        if (!success) {
            return Response.Forbidden({
                message: 'failed to teardown post',
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
