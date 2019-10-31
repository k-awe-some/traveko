import nodemailer, { TransportOptions } from "nodemailer";

interface MailOptions {
  email: string;
  subject: string;
  text?: string;
  message: string;
}

interface Test extends TransportOptions {
  host: string;
}

const sendEmail = async (options: MailOptions) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  } as Test);

  // 2. Define email options
  const mailOptions = {
    from: "Kay Nguyen <kaynguyen.dev@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3. Send
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
