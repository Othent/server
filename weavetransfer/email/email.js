
import nodemailer from 'nodemailer';
import fs from 'fs';

const sendEmail = (user_email_from, user_message_from, user_email_to, file_download_link) => {
  // client
  const client_user = process.env.nodemailer_email;
  const client_password = process.env.nodemailer_password;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: client_user,
      pass: client_password,
    },
  });

  const template = fs.readFileSync('./template.html', 'utf8');

  const message = {
    from: client_user,
    to: user_email_to,
    subject: `${user_email_from} has sent you a file - via WeaveTransfer.com`,
    html: template
      .replace(
        '{{download_link}}',
        `<a href="${file_download_link}" style="background-color: #2375EF; border-radius: 5px; color: white; padding: 10px; margin-top: 20px; margin-bottom: 20px; text-decoration: none;">Download your file</a>`
      )
      .replace('{{message}}', `${user_email_from} included this message: ${user_message_from}`)
      .replace('{{user_email_from}}', user_email_from)
      .replace('{{user_email_to}}', user_email_to),
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      return 'Email sent';
    }
  });
};

export { sendEmail };

