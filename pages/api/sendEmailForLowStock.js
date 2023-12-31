// pages/api/sendEmail.js

import nodemailer from 'nodemailer';
export default async (req, res) => {
    res.json(req.method);
  if (req.method === 'POST') {
    // Create a nodemailer transporter with your SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'htetpaingwin1999@gmail.com',
        pass: 'rzkjgyajgtejcbwd',
      },
    });

    // Define the email message
    const mailOptions = {
      from: 'htetpaingwin1999@gmail.com',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    };

    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
