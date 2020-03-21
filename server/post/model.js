const mongoose = require('mongoose');
const Schema = mongoose.Schema
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const postSchema = new Schema({
    _id: ObjectIdSchema,
    title: {
        type: String, 
        required: true
    },
    type: {
        type: String, 
        enum: ['offer','request'], 
        required: true
    },
    tags: {
        type: String, 
        enum: [], // TODO: decide on tags
        required: false
    },
    body: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        enum: ['active', 'closed'], 
        required: true
    },
    teardownHash: {
        type: ObjectId,
        required: true
    },
    closeReason: {
        type: String,
        enum: [] // TODO: decide on close reasons
    },
    created: {
        type: Date,
        required: true
    },
    updated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Post', postSchema)
