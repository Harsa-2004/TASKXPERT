const History = require("../models/History");
await transporter.sendMail(mailOptions);

const newHistory = new History({
  email: from, // or req.body.from if passed by frontend
  task: "Email Sent",
  status: "Success" || "Failed",
  time: new Date().toLocaleString()
});

await newHistory.save();
