const SMTPClient = require('smtp-client').SMTPClient;

const client = new SMTPClient({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  user: 'username',
  pass: 'password'
});

client.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello, this is a test email!'
}, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
