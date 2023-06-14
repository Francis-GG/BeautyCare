require('dotenv').config({ path: '../twilio.env' });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+14027714519',
     to: '+56995450522'
   })
  .then(message => console.log(message.sid));
