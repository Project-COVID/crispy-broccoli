const mailer = require('./index');

const offerToHelpTemplateId = 'd-7c8525987520411da6b9acfedeac0a52';
const requestForHelpTemplateId = 'd-6d40097ec0e94b018176a0ee5b181d7d';

module.exports = function(postType, postId, verifyHash, name, email) {
    let templateId = offerToHelpTemplateId;
    if (postType === 'request') {
        templateId = requestForHelpTemplateId;
    }
    return mailer.send({
        to: email,
        from: 'yourfriends@kindnessproject.xyz',
        templateId,
        dynamic_template_data: {
            postId,
            verifyHash,
            name,
        },
    });
};
