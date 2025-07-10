const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { name, email, subject, message } = JSON.parse(event.body);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: info.messageId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};