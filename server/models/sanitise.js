const _ = require('lodash');

module.exports = {
    post: (post) => _.pick(post, ['id', 'title', 'body', 'type', 'location', 'coords', 'tags', 'name', 'createdAt']),
};
