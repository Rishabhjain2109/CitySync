const nodemailer = require('nodemailer');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE; // your Twilio number

const client = twilio(accountSid, authToken);


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
      // Format phone number for Indian numbers
      let formattedNumber = to;
      
      // If it's a 10-digit Indian number, add +91
      if (/^\d{10}$/.test(to)) {
        formattedNumber = `+91${to}`;
        console.log('Formatted Indian number:', formattedNumber);
      }
      // If it already has +91, use as is
      else if (to.startsWith('+91')) {
        formattedNumber = to;
        console.log('Already formatted with +91:', formattedNumber);
      }
      // If it starts with 91, add +
      else if (to.startsWith('91')) {
        formattedNumber = `+${to}`;
        console.log('Added + to 91:', formattedNumber);
      }
      
      console.log('Attempting to send SMS to:', formattedNumber);
      console.log('SMS message:', body);
      
      const message = await client.messages.create({
        body,
        from: fromNumber, 
        to: formattedNumber,
      });
      console.log(' SMS sent successfully:', message.sid);
      console.log('Message status:', message.status);
    } catch (err) {
      console.error(' SMS error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
    }
  };
  

module.exports = { sendEmail, sendSMS};
