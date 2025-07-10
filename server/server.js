require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const serverless = require('serverless-http');

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 8888;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // 5 requests per window

// Simple rate limiting storage
const requestCounts = new Map();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Handle pre-flight requests
app.options('*', cors());

// Custom JSON body parser middleware
app.use(express.text({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json' && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
      console.log('Successfully parsed JSON body:', req.body);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      return res.status(400).json({ 
        error: 'Invalid JSON format',
        details: e.message
      });
    }
  }
  next();
});

// Rate limiting middleware
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  requestCounts.forEach((timestamps, ip) => {
    requestCounts.set(ip, timestamps.filter(t => t > windowStart));
  });

  const timestamps = requestCounts.get(ip) || [];
  if (timestamps.length >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: `${retryAfter} seconds`
    });
  }

  timestamps.push(now);
  requestCounts.set(ip, timestamps);
  next();
});

// Email validation function
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    // Validate required fields
    const { name, email, subject, message } = req.body;
    const missingFields = [];

    if (!name?.trim()) missingFields.push('name');
    if (!email?.trim()) missingFields.push('email');
    if (!subject?.trim()) missingFields.push('subject');
    if (!message?.trim()) missingFields.push('message');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        received: req.body
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        receivedEmail: email
      });
    }

    // Validate message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        length: message.length
      });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: true,
      maxConnections: 1,
      connectionTimeout: 5000,
      socketTimeout: 10000,
      tls: { rejectUnauthorized: false }
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error('Email service unavailable');
    }

    // Prepare email
    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${subject.substring(0, 100)}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${message}</td>
            </tr>
          </table>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: req.id
  });
});
app.get('/api/check-env', (req, res) => {
  res.json({
    emailUser: process.env.EMAIL_USER ? "****" : "MISSING",
    emailPass: process.env.EMAIL_PASS ? "****" : "MISSING"
  });
});
// Netlify Lambda handler
const handler = serverless(app, {
  binary: ['image/*'],
  request: (req) => {
    req.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
});

// Local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Listening on port ${PORT}`);
    console.log('Allowed origins:', [
      'http://localhost:3000',
      'https://your-netlify-site.netlify.app'
    ]);
  });
}

module.exports = {
  handler,
  app
};