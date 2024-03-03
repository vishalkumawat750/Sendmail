const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const sharp = require('sharp');

const app = express();

app.use(cors());
// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST request to /send-email
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("api called!");
    
    EditSharpImage();
    //EditGMImage();

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'JigarKumawat236@gmail.com',
        pass: 'uowa jazs clev bhcy'
      }
    });

    // Send email using Nodemailer
    await transporter.sendMail({
      from: 'JigarKumawat236@gmail.com',
      to: email,
      subject: 'Thank you from LaPhysics',
      text: `Dear ${name},\n\nThank you for supporting us. We have received your message: ${message}\n\nBest regards,\nBhavans Physics Society. La Physics`,
      attachments: [
        {
          filename: 'ThankYouLetter.jpg', // Name of the attachment file
          path: '../thankyou/edited_image.png', // Path to the image file on your local filesystem
          cid: 'image' // Content ID for referencing the image in the HTML content
        }
      ]
    });

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

function EditSharpImage(){
  sharp('../thankyou/White.jpg')
    .metadata()
    .then(metadata => {
      console.log("metadata : ", metadata);
      const imageHeight = metadata.height;
      const textPositionPercentage = 0.1; // 40% from the top
      const textYCoordinate = imageHeight * textPositionPercentage;
      console.log("textYCoordinate : ", textYCoordinate);
      return sharp('../thankyou/White.jpg')
      .composite([{
        input: Buffer.from(`<svg><text x="10%" y="100%" font-family="Arial" font-size="30px" fill="black">Hello, world!</text></svg>`),
        gravity: 'north' // Position the text at the top of the image
      }])
        .toFile('output.jpg', (err, info) => {
          if (err) {
            console.error('Error processing image:', err);
          } else {
            console.log('Image processed successfully:', info);
          }
        });
    })
    .catch(err => {
      console.error('Error fetching image metadata:', err);
    });
}


function EditGMImage(){
  const gm = require('gm').subClass({ imageMagick: true });

const imagePath = 'White.jpg';
const outputImagePath = 'output.jpg';

// Add text to the image
gm(imagePath)
.font('Arial', 50)
  .fill('black')
  .drawText(0, 0, 'Hello, world!', 'NorthWest') // 'NorthWest' gravity
  .write(outputImagePath, (err) => {
    if (err) {
      console.error('Error processing image:', err);
    } else {
      console.log('Image processed successfully');
    }
  });

}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
