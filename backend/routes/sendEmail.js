const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post("/send-email",  upload.single('attachment'),async (req, res) => {
  const { to, subject, body } = req.body;
  const file = req.file;

  try {
    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // App password (not your Gmail password!)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
      attachments: file ? [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ] : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
