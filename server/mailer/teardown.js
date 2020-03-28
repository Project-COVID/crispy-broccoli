const mailer = require('./index');

const templateId = 'd-9e472f554acf47f4a626112db0d920ce';

module.exports = function (postId, teardownHash, name, email) {
    return mailer.send({
        to: {
            name: name,
            email: email,
        },
        from: {
            name: 'The Kindness Project',
            email: 'yourfriends@kindnessproject.xyz',
        },
        templateId,
        dynamic_template_data: {
            postId,
            teardownHash,
            name,
        },
    });
};
