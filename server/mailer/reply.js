const mailer = require('./index');

const templateId = 'd-c47db9a6e8364bcfb8ed26e0549661f0';

module.exports = function (postId, posterName, posterEmail, responderName, body, responderEmail) {
    return mailer.send({
        to: {
            name: posterName,
            email: posterEmail,
        },
        from: {
            name: 'The Kindness Project',
            email: 'yourfriends@kindnessproject.xyz',
        },
        replyTo: responderEmail,
        templateId,
        dynamic_template_data: {
            postId,
            posterName,
            responderName,
            body,
        },
    });
};
