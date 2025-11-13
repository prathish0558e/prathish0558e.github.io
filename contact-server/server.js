// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow your frontend origin (or '*' for quick testing)
app.use(cors({
  origin: true,
  methods: ['GET','POST','OPTIONS']
}));

// basic rate limit to reduce spam
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per IP per minute
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/contact', limiter);

// If you want to serve your static frontend from this server, uncomment:
// app.use(express.static(path.join(__dirname, 'public')));

// create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_SECURE === 'true') || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify transporter on startup (optional)
transporter.verify().then(() => {
  console.log('SMTP Ready');
}).catch(err => {
  console.error('SMTP config error:', err.message || err);
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required: name, email, message.' });
    }

    // sanitize minimal (escape)
    const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const mailHtml = `
      <h3>New message from portfolio contact form</h3>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <hr />
      <p style="white-space:pre-wrap;">${esc(message)}</p>
    `;

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: mailHtml
    });

    console.log('Message sent:', info.messageId);
    res.json({ ok: true, message: 'Sent' });
  } catch (err) {
    console.error('Send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Contact server listening on ${PORT}`));
