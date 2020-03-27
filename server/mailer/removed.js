const mailer = require('./index');

const templateId = 'd-ea3e72bb968f4e3499504bb13b90fe9f';

module.exports = function (postId, name, email) {
    return mailer.send({
        to: email,
        from: 'yourfriends@kindnessproject.xyz',
        templateId,
        dynamic_template_data: {
            postId,
            name,
        },
    });
};
