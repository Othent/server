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


  // send to
  let template_to = await fetch('https://othent.io/email-template-from.html');
  template_to = await template_to.text()
  const message_to = {
    from: process.env.nodemailer_email,
    to: user_email_to,
    subject: `${user_email_from} has sent you a file - via WeaveTransfer.com`,
    html: template_to
      .replace(
        '{{download_link}}',
        `<a href="${file_download_link}" style="background-color: #2375EF; border-radius: 5px; color: white; padding: 10px; margin-top: 20px; margin-bottom: 20px; text-decoration: none;">Download your file</a>`
      )
      .replace('{{message}}', user_message_from)
      .replace('{{user_email_from}}', user_email_from)
      .replace('{{user_email_to}}', user_email_to)
      .replace('{{shareable_link}}', file_download_link)
  };
  transporter.sendMail(message_to, (error, info) => {
    if (error) {
      console.log(error, info);
      throw new Error(error);
    } else {
      return 'Email sent';
    }
  });


  // send from
  let template_from = await fetch('https://othent.io/email-template-from.html');
  template_from = await template_from.text()
  const message_from = {
    from: process.env.nodemailer_email,
    to: user_email_to,
    subject: `Your file to ${user_email_to} has been sent - via WeaveTransfer.com`,
    html: template_from
      .replace(
        '{{download_link}}',
        `<a href="${file_download_link}" style="background-color: #2375EF; border-radius: 5px; color: white; padding: 10px; margin-top: 20px; margin-bottom: 20px; text-decoration: none;">Download your file</a>`
      )
      .replace('{{message}}', user_message_from)
      .replace('{{user_email_from}}', user_email_from)
      .replace('{{user_email_to}}', user_email_to)
      .replace('{{shareable_link}}', file_download_link)
  };
  transporter.sendMail(message_from, (error, info) => {
    if (error) {
      console.log(error, info);
      throw new Error(error);
    } else {
      return 'Email sent';
    }
  });





};


