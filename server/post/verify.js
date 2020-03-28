const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');
const sanitise = require('../models/sanitise');
const sendTeardownEmail = require('../mailer/teardown');

async function verifyPost(id, hash) {
    const post = await Post.findById(id);
    if (post.verifyHash !== hash) {
        return null;
    }
    post.verified = true;
    await post.save();
    await sendTeardownEmail(id, post.teardownHash, post.name, post.email);
    return post;
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

        const post = await verifyPost(req.params.id, req.body.hash);
        if (!post) {
            return Response.Forbidden({
                message: 'failed to verify post',
            });
        }
        return Response.OK(sanitise.post(post));
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
