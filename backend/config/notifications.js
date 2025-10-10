const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Email error:', err);
  }
};

const sendSMS = async (to, body) => {
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log('SMS sent:', message.sid);
  } catch (err) {
    console.error('SMS error:', err);
  }
};

module.exports = { sendEmail, sendSMS };
