const _ = require('lodash');
const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');
const constants = require('../models/constants');
const sanitise = require('../models/sanitise');

const DEFAULT_LIMIT = 3;
const DEFAULT_RADIUS_KM = 5;

function kmToRadian(km) {
    const earthRadiusInKm = 6371;
    return km / earthRadiusInKm;
}

async function getPostsInRadius(type, lat, lon, radius, cursor, limit) {
    const query = {
        type: type,
        verified: true,
        status: constants.statuses.active,
        coords: {
            $geoWithin: {
                $centerSphere: [[lon, lat], kmToRadian(radius || DEFAULT_RADIUS_KM)],
            },
        },
    };
    const pagination = {};
    if (cursor) {
        pagination._id = { $lt: cursor };
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

async function getPosts(req) {
    try {
        await Joi.validate(req.query, {
            type: Joi.string().valid(Object.keys(constants.types)).required(),
            lat: Joi.number().required(),
            lon: Joi.number().required(),
            cursor: Joi.string().hex(),
            limit: Joi.number().max(10),
            radius: Joi.number() // radius in km
                // must be < 20 miles, with room for rounding errors
                .max(1.60934 * 20.1),
        });

        let result = await getPostsInRadius(
            req.query.type,
            Number(req.query.lat),
            Number(req.query.lon),
            Number(req.query.radius),
            req.query.cursor,
            Number(req.query.limit),
        );

        return Response.OK({ posts: result.posts.map((post) => sanitise.post(post)), total: result.total });
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
}

async function getPost(req) {
    try {
        await Joi.validate(req.params, {
            id: Joi.string().hex().required(),
        });

        let post = await Post.findById(req.params.id);
        if (post && (!post.verified || post.status !== constants.statuses.active)) {
            return Response.BadRequest({
                message: 'Post has not been verified or is not active',
            });
        }

        return Response.OK(sanitise.post(post));
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
}

module.exports = { getPosts, getPost };
