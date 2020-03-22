const mailer = require('./index');

const templateId = 'd-7c8525987520411da6b9acfedeac0a52';

module.exports = function(toName, toEmail) {
    return mailer.send({
        to: toEmail,
        from: 'mikescottchristensen@gmail.com',
        templateId,
        dynamic_template_data: {
            name: toName,
        },
    });
};
