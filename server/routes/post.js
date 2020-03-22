const express = require('express');
const getPost = require('../post/get');
const createPost = require('../post/create');
const verifyPost = require('../post/verify');
const replyPost = require('../post/reply');
const teardownPost = require('../post/teardown');

const Response = require('../response');

module.exports = function() {
    const router = express.Router();

    router.route('/').get(async (req, res) => {
        try {
            const reply = await getPost(req);
            return reply.send(res);
        } catch (err) {
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    router.route('/').post(async (req, res) => {
        try {
            const reply = await createPost(req);
            return reply.send(res);
        } catch (err) {
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    router.route('/:id/verify').get(async (req, res) => {
        try {
            const reply = await verifyPost(req);
            return reply.send(res);
        } catch (err) {
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    router.route('/:id/reply').post(async (req, res) => {
        try {
            const reply = await replyPost(req);
            return reply.send(res);
        } catch (err) {
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    router.route('/:id/teardown').get(async (req, res) => {
        try {
            const reply = await teardownPost(req);
            return reply.send(res);
        } catch (err) {
            req.log.error(err);
            return Response.InternalServerError().send(res);
        }
    });

    return router;
};
