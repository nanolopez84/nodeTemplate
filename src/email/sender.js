const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.send({
    to: 'nano.lopez.84@gmail.com',
    from: 'nano.lopez.84@gmail.com',
    subject: 'Mail subject',
    text: 'Mail text'
});