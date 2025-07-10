require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();


app.use(express.json()); // Must come first
app.use(cors());

// DEBUG MIDDLEWARE
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length']
  });
  next();
});

// EMAIL ENDPOINT
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Raw body received:', req.body);

    // Manual validation
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    const { name, email, subject, message } = req.body;
    const missingFields = [];

    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!subject) missingFields.push('subject');
    if (!message) missingFields.push('message');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields",
        missing: missingFields
      });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${message}</p>
        </div>
      `
    });

    res.json({ 
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});