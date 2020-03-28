const mailer = require('./index');

const templateId = 'd-f5d2ed9407f14cc29cdeb07f5f094c6f';

module.exports = function (postId, message, teardownHash) {
    return mailer.send({
        to: 'yourfriends+report@kindnessproject.xyz',
        from: {
            name: 'The Kindness Project',
            email: 'yourfriends@kindnessproject.xyz',
        },
        templateId,
        dynamic_template_data: {
            postId,
            message,
            teardownHash,
        },
    });
};
