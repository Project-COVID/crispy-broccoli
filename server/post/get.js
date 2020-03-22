const Joi = require('joi');
const Response = require('../response');
const Post = require('../models/post');

const DEFAULT_RADIUS_KM = 5

function kmToRadian(km) {
    const earthRadiusInKm = 6371;
    return km / earthRadiusInKm;
}

async function getPost(req, postType, params) {
    req.log.info('Get post!', req.query);

    // Return the 10 most recent posts for the given type
    try {
        // If the get request specifies coordinates, filter posts within a given radius of that
        if (params.lat !== undefined && params.lon !== undefined) {
            return await Post.find({
                type: postType,
                // verified: true,
                status: 'active',
                location: {
                    $geoWithin: {
                        $center: [[params.lon, params.lat], kmToRadian(DEFAULT_RADIUS_KM)]
                      }
                }
            }).sort({
                createdAt: -1
            }).limit(10);
        }

        // By default just return the 10 latest posts regardless of distance
        return await Post.find({
            type: postType,
            // verified: true,
            status: 'active',
        }).sort({
            createdAt: -1
        }).limit(10);
    } catch(err) {
        throw err; 
    }
}

module.exports = async function (req) {
    try {
        await Joi.validate(req.query, {
            lat: Joi.number(),
            lon: Joi.number(),
        });

        let offersList = await getPost(req, 'offer', req.query);
        let requestsList = await getPost(req, 'request', req.query);

        return Response.OK({offers: offersList, requests: requestsList});
    } catch (err) {
        if (err.isJoi) {
            return Response.BadRequest(err.details);
        }
        throw err;
    }
};
