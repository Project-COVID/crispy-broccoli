const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Post',
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['offer', 'request'],
            required: true,
        },
        tags: {
            type: [String],
            enum: ['food'], // TODO: decide on tags
            required: false,
        },
        email: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'closed'],
            default: 'active',
            required: true,
        },
        teardownHash: {
            type: String,
            required: true,
        },
        teardownReason: {
            type: String,
            enum: ['unavailable'], // TODO: decide on teardown reasons
        },
        created: {
            type: Date,
            required: true,
        },
        updated: {
            type: Date,
            required: true,
        },
    }),
);
