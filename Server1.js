const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const sharp = require('sharp');
const { PDFDocument, rgb, StandardFonts  } = require('pdf-lib');
const fs = require('fs');

const app = express();

app.use(cors());
// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST request to /send-email
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    console.log("api called!");
    
    var outputFile = 'output.pdf';
    editTextInPDF('input.pdf', outputFile, name);

    await sendEmail(email, name, message, subject, outputFile);
    
    console.log("Email sent successfully");
    res.status(200).send('Email sent successfully');
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

async function sendEmail(email, name, message, subject, filename){
  
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'JigarKumawat236@gmail.com',
        pass: 'uowa jazs clev bhcy'
      }
    });

    // Read the PDF file content
    const pdfAttachment = await fs.promises.readFile(filename);

    // Send email using Nodemailer
    await transporter.sendMail({
      from: 'JigarKumawat236@gmail.com',
      to: email,
      subject: subject,
      text: `Dear ${name},\n\n${message}`,
      attachments: [
        {
          filename: 'ThankYouLetter.pdf', // Name of the attachment file
          content: pdfAttachment, // Content of the attachment (PDF file content)
          contentType: 'application/pdf' // Content type of the attachment
        }
      ]
    });

}

async function editTextInPDF(inputFilePath, outputFilePath, newText) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(inputFilePath));
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // const fontBytes = await fs.promises.readFile('Oregano-Regular.ttf'); // Adjust the path to your font file
  // const customFont = await pdfDoc.embedFont(fontBytes);
  let font = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
  firstPage.drawText(newText, {
      x: 190,
      y: height - 485,
      size: 32,
      font: font,
      color: rgb(0,0,0),
  });
  fs.writeFileSync(outputFilePath, await pdfDoc.save());
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
