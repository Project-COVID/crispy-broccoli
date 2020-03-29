const Joi = require('joi');
const Post = require('../models/post');
const constants = require('../models/constants');
const sendRemovedPostEmail = require('../mailer/removed');
const Response = require('../response');

async function teardownPost(id, hash) {
    const post = await Post.findById(id);
    if (post.teardownHash === hash) {
        post.status = constants.statuses.closed;
        post.updated = new Date();
        await post.save();
        await sendRemovedPostEmail(id, post.name, post.email);
        return true;
    }
    return false;
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

        const success = await teardownPost(req.params.id, req.body.hash);
        if (!success) {
            return Response.Forbidden({
                message: "Couldn't remove post",
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
