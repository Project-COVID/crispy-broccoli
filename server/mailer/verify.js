const mailer = require('./index');

const templateId = 'd-cf45e42acba34685a5866e0dfe54e79d';

module.exports = function (postType, postId, verifyHash, name, email) {
    let isOffer = true;
    if (postType === 'request') {
        isOffer = false;
    }
    return mailer.send({
        to: email,
        from: 'yourfriends@kindnessproject.xyz',
        templateId,
        dynamic_template_data: {
            postId,
            verifyHash,
            name,
            isOffer,
        },
    });
};
