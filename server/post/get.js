const _ = require('lodash');
const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');
const constants = require('../models/constants');

const DEFAULT_LIMIT = 15;
const DEFAULT_RADIUS_KM = 5;

function kmToRadian(km) {
    const earthRadiusInKm = 6371;
    return km / earthRadiusInKm;
}

function sanitisePosts(posts) {
    return posts.map((post) => _.pick(post, ['title', 'body', 'type', 'location', 'tags', 'name', 'email']));
}

async function getPosts(type, lat, lon, radius, cursor, limit) {
    try {
        if (lat && lon) {
            return Post.find({
                type,
                verified: true,
                status: constants.statuses.active,
                location: {
                    $geoWithin: {
                        $center: [[lon, lat], kmToRadian(radius || DEFAULT_RADIUS_KM)],
                    },
                },
                ...(cursor && { _id: { $gt: cursor } }),
            })
                .sort({
                    createdAt: -1,
                })
                .limit(limit || DEFAULT_LIMIT);
        }
        return Post.find({
            type,
            verified: true,
            status: constants.statuses.active,
            ...(cursor && { _id: { $gt: cursor } }),
        })
            .sort({
                createdAt: -1,
            })
            .limit(limit || DEFAULT_LIMIT);
    } catch (err) {
        throw err;
    }
}

module.exports = async function (req) {
    try {
        await Joi.validate(req.query, {
            type: Joi.string().valid(Object.values(constants.types)).required(),
            lat: Joi.number(),
            lon: Joi.number(),
            cursor: Joi.string().hex(),
            limit: Joi.number(),
            radius: Joi.number(), // in km
        });

        let posts = await getPosts(
            req.query.type,
            req.query.lat,
            req.query.lon,
            req.query.radius,
            req.query.cursor,
            req.query.limit,
        );
        let nextCursor = null;
        if (posts && posts.length > 0) {
            nextCursor = posts[posts.length - 1]._id;
        }

        return Response.OK({ posts: sanitisePosts(posts), nextCursor });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
