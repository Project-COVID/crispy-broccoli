const mailer = require('./index');
const constants = require('../models/constants');

const templateId = 'd-cf45e42acba34685a5866e0dfe54e79d';

module.exports = function (postType, postId, verifyHash, name, email) {
    return mailer.send({
        to: email,
        from: 'yourfriends@kindnessproject.xyz',
        templateId,
        dynamic_template_data: {
            postId,
            verifyHash,
            name,
            isOffer: postType === constants.types.offer,
        },
    });
};
