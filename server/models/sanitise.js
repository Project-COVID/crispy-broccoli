const _ = require('lodash');

module.exports = {
    post: (post) => _.pick(post, ['title', 'body', 'type', 'location', 'coords', 'tags', 'name', 'email', 'createdAt']),
};
