import nodemailer from 'nodemailer';
import fs from 'fs';



export default async function sendEmail(user_email_from, user_message_from, user_email_to, file_download_link) {


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });

  console.log(1)

  let template = fetch('https://othent.io/email-template.html');
  template = (await template).text

  console.log(2)

  console.log(template)

  const message = {
    from: process.env.nodemailer_email,
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


