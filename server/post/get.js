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
    return posts.map(post => _.pick(post, ['title', 'body', 'type', 'location', 'tags', 'name', 'email']));
}

async function getPosts(type, lat, lon, radius, cursor, limit) {
    const query = {
        type,
        verified: true,
        status: constants.statuses.active,
        location: {
            $geoWithin: {
                $center: [[lon, lat], kmToRadian(radius || DEFAULT_RADIUS_KM)],
            },
        },
    };
    const pagination = {};
    if (cursor) {
        pagination._id = { $gt: cursor };
    }
    return {
        total: await Post.count(query),
        posts: await Post.find(Object.assign(query, pagination))
            .sort({
                createdAt: -1,
            })
            .limit(limit || DEFAULT_LIMIT),
    };
}

module.exports = async function(req) {
    try {
        await Joi.validate(req.query, {
            type: Joi.string()
                .valid(Object.values(constants.types))
                .required(),
            lat: Joi.number().required(),
            lon: Joi.number().required(),
            cursor: Joi.string().hex(),
            limit: Joi.number().max(10),
            radius: Joi.number(), // in km
        });

        let result = await getPosts(
            req.query.type,
            req.query.lat,
            req.query.lon,
            req.query.radius,
            req.query.cursor,
            req.query.limit,
        );
        let nextCursor = null;
        if (result && result.posts && result.posts.length > 0) {
            nextCursor = result.posts[result.posts.length - 1]._id;
        }

        return Response.OK({ posts: sanitisePosts(result.posts), total: result.total, nextCursor });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
