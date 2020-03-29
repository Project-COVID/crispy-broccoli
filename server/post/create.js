const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const Response = require('../response');
const Post = require('../models/post');
const constants = require('../models/constants');
const sendVerifyEmail = require('../mailer/verify');

async function alreadyHasPost(email) {
    const post = await Post.exists({
        email,
        status: constants.statuses.active,
    });
    return !!post;
}

async function createPost(data) {
    data.teardownHash = uuidv4();
    data.verifyHash = uuidv4();
    data.coords = { type: 'Point', coordinates: [data.lon, data.lat] }; // NOTE: In GeoJSON coordinates longitude comes first
    const post = await new Post(data).save();
    await sendVerifyEmail(data.type, post.id, data.verifyHash, data.name, data.email);
}

module.exports = async function (req) {
    try {
        await Joi.validate(
            req.body,
            {
                title: Joi.string().max(200).required(),
                body: Joi.string().max(500),
                type: Joi.string().valid(Object.keys(constants.types)).required(),
                location: Joi.string().required(),
                lon: Joi.number().required(),
                lat: Joi.number().required(),
                tags: Joi.array()
                    .items(Joi.string().valid(Object.keys(constants.tags)))
                    .min(1)
                    .required(),
                name: Joi.string().max(20).required(),
                email: Joi.string().email().required(),
            },
            {
                abortEarly: false,
            },
        );

        if (await alreadyHasPost(req.body.email)) {
            return Response.BadRequest({
                message: 'Only one active post per user is allowed',
            });
        }

        await createPost(req.body);

        return Response.Created();
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
