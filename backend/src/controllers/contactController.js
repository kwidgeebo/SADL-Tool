const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
})

const sendContactEmail = async (req, res) => {
  const { name, rank, unit, email, message } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields: name and email" })
  }

  const htmlBody = `
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:600px;">
      <tr style="background:#041534;color:#fff;">
        <td colspan="2" style="padding:12px 16px;font-size:18px;font-weight:bold;">
          SADL-UP — New Demo Request
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-weight:bold;width:140px;border-bottom:1px solid #eee;">Name</td>
        <td style="padding:8px 16px;border-bottom:1px solid #eee;">${name}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-weight:bold;border-bottom:1px solid #eee;">Rank / Role</td>
        <td style="padding:8px 16px;border-bottom:1px solid #eee;">${rank || "—"}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-weight:bold;border-bottom:1px solid #eee;">Unit / Organisation</td>
        <td style="padding:8px 16px;border-bottom:1px solid #eee;">${unit || "—"}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-weight:bold;border-bottom:1px solid #eee;">Email</td>
        <td style="padding:8px 16px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-weight:bold;">Message</td>
        <td style="padding:8px 16px;">${message ? message.replace(/\n/g, "<br>") : "—"}</td>
      </tr>
    </table>
  `

  const textBody = [
    "SADL-UP — New Demo Request",
    "----------------------------",
    `Name:                ${name}`,
    `Rank / Role:         ${rank || "—"}`,
    `Unit / Organisation: ${unit || "—"}`,
    `Email:               ${email}`,
    `Message:             ${message || "—"}`,
  ].join("\n")

  try {
    await transporter.sendMail({
      from: `"SADL-UP Contact Form" <${process.env.BREVO_SMTP_LOGIN}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: `SADL-UP Demo Request — ${name}${rank ? ` (${rank})` : ""}`,
      html: htmlBody,
      text: textBody,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Nodemailer error:", error)
    return res.status(500).json({ error: "Failed to send email" })
  }
}

module.exports = { sendContactEmail }