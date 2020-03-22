const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
    throw new Error('Missing SENDGRID_API_KEY');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = sgMail;
