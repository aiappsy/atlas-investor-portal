const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Read .env.local manually if dotenv is not present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const idx = line.indexOf('=');
      const k = line.substring(0, idx).trim();
      const v = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      process.env[k] = v;
    }
  });
}

const user = (process.env.SMTP_USER || '').trim();
const pass = (process.env.SMTP_PASS || '').trim().replace(/\s+/g, '');

console.log('Testing Gmail SMTP with user:', user);
console.log('App password configured:', pass ? `Yes (${pass.length} chars)` : 'No');

if (!user || !pass) {
  console.error('Error: SMTP_USER and SMTP_PASS must be set in .env.local');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Gmail SMTP Verification Failed:', err.message);
    process.exit(1);
  } else {
    console.log('Gmail SMTP connection verified successfully! Ready to deliver OTP codes.');
    process.exit(0);
  }
});
