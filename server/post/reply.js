const Joi = require('joi');
const Post = require('../models/post');
const Response = require('../response');
const sendReplyEmail = require('../mailer/reply');

class PostClosedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PostClosedError';
    }
}

class PostNotVerifiedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PostNotVerifiedError';
    }
}

async function replyToPost(id, name, email, body) {
    const post = await Post.findById(id);
    if (post.status !== 'active') {
        throw new PostClosedError();
    } else if (!post.verified) {
        throw new PostNotVerifiedError();
    }
    await sendReplyEmail(post.id, post.name, post.email, name, body, email);
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.params, {
            id: Joi.string()
                .hex()
                .required(),
        });
        await Joi.validate(req.body, {
            name: Joi.string()
                .min(1)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            body: Joi.string()
                .min(1)
                .required(),
        });

        await replyToPost(req.params.id, req.body.name, req.body.email, req.body.body);

        return Response.OK({ hello: 'world' });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        } else if (err instanceof PostClosedError) {
            return Response.BadRequest({
                message: 'that post is closed',
            });
        } else if (err instanceof PostNotVerifiedError) {
            return Response.BadRequest({
                message: 'that post has not been verified',
            });
        }
        throw err;
    }
};
