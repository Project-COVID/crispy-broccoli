const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const Response = require('../response');
const Post = require('../models/post');

async function createPost(data) {
    data.teardownHash = uuidv4();
    await new Post(data).save();
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
