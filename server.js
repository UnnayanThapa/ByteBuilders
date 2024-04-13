const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { PassGenerator } = require('passkit-generator');
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.json());

// Configure mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // For example, using Gmail
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

// Your pass generator setup
const pass = new PassGenerator({
    model: './path/to/pass/model',
    certificates: {
        wwdr: './path/to/certificates/wwdr.pem',
        signerCert: './path/to/certificates/signercert.pem',
        signerKey: {
            keyFile: './path/to/certificates/signerkey.pem',
            passphrase: 'your-passphrase'
        }
    }
});

    try {
        // Generate the Wallet pass
        const examplePass = await pass.createPass({
            serialNumber: cwid, // Use CWID as a unique identifier
            description: 'University Access Card',
            organizationName: 'University',
            foregroundColor: '#000000',
            backgroundColor: '#ffffff',
            labelColor: '#333333'
        });

        // Email the pass to the user
        const mailOptions = {
            from: 'utsabneupane97@gmail.com',
            to: email,
            subject: 'Your University Access Card',
            text: 'Please find your University Access Card attached.',
            attachments: [{
                filename: 'accessCard.pkpass',
                content: examplePass.asBuffer(),
                contentType: 'application/vnd.apple.pkpass'
            }]
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Wallet pass generated and email sent." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: "Failed to generate pass or send email." });
    }
;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});