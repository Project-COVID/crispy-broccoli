const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');
const sendTeardownEmail = require('../mailer/teardown');

async function verifyPost(id, hash) {
    const post = await Post.findById(id);
    if (post.verifyHash !== hash) {
        return false;
    }
    post.verified = true;
    await post.save();
    await sendTeardownEmail(id, post.teardownHash, post.name, post.email);
    return true;
}

module.exports = async function (req) {
    try {
        await Joi.validate(req.body, {
            hash: Joi.string()
                .guid({
                    version: ['uuidv4'],
                })
                .min(1)
                .required(),
        });

        const success = await verifyPost(req.params.id, req.body.hash);
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
