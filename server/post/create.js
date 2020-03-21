const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const Response = require('../response');
const Post = require('../models/post');
const sendVerifyEmail = require('../mailer/verify');

async function createPost(data) {
    data.teardownHash = uuidv4();
    data.verifyHash = uuidv4();
    const post = await new Post(data).save();
    await sendVerifyEmail(data.type, post.id, data.verifyHash, data.name, data.email);
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.body, {
            title: Joi.string()
                .min(1)
                .required(),
            lat: Joi.number()
                .min(1)
                .required(),
            lon: Joi.number()
                .min(1)
                .required(),
            body: Joi.string()
                .min(1)
                .required(),
            type: Joi.string()
                .valid(['offer', 'request'])
                .required(),
            tags: Joi.array()
                .items(Joi.string().valid(['food']))
                .min(1),
            name: Joi.string()
                .min(1)
                .required(),
            email: Joi.string()
                .email()
                .required(),
        });

        await createPost(req.body);

        return Response.Created();
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
