const Joi = require('joi');
const Post = require('../models/post');
const Response = require('../response');
const sendReportEmail = require('../mailer/report');

async function reportPost(id, message) {
    const post = await Post.findById(id);
    await sendReportEmail(post.id, message, post.teardownHash);
}

module.exports = async function (req) {
    try {
        await Joi.validate(req.params, {
            id: Joi.string().hex().required(),
        });
        await Joi.validate(req.body, {
            body: Joi.string(),
        });

        await reportPost(req.params.id, req.body.body);

        return Response.OK();
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
