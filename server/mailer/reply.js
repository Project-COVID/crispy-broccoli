const mailer = require('./index');

const templateId = 'd-c47db9a6e8364bcfb8ed26e0549661f0';

module.exports = function (postId, posterName, posterEmail, responderName, body, responderEmail) {
    return mailer.send({
        to: posterEmail,
        replyTo: responderEmail,
        from: 'yourfriends@kindnessproject.xyz',
        templateId,
        dynamic_template_data: {
            postId,
            posterName,
            responderName,
            body,
        },
    });
};
