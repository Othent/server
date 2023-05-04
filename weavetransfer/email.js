import nodemailer from 'nodemailer';


export default async function sendEmail(sendFromEmail, sendToEmail, fileDownloadLink) {


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.nodemailer_email_WT,
      pass: process.env.nodemailer_password_WT,
    },
  });


  // send to
  let template_to = await fetch('https://weavetransfer.othent.io/email-template-to.html');
  template_to = await template_to.text()
  const message_to = {
    from: process.env.nodemailer_email_WT,
    to: sendToEmail,
    subject: `${sendFromEmail} has sent you a file - via WeaveTransfer`,
    html: template_to
      .replace(
        '{{download_link}}',
        `<a href="${fileDownloadLink}" style="background-color: #2375EF; border-radius: 5px; color: white; padding: 10px; margin-top: 20px; margin-bottom: 20px; text-decoration: none;">Download your file</a>`
      )
      .replace('{{sendFromEmail}}', sendFromEmail)
      .replace('{{sendToEmail}}', sendToEmail)
      .replace('{{fileDownloadLink}}', fileDownloadLink)
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
  let template_from = await fetch('https://weavetransfer.othent.io/email-template-from.html');
  template_from = await template_from.text()
  const message_from = {
    from: process.env.nodemailer_email_WT,
    to: sendToEmail,
    subject: `Your file to ${sendToEmail} has been sent - via WeaveTransfer`,
    html: template_from
      .replace(
        '{{download_link}}',
        `<a href="${fileDownloadLink}" style="background-color: #2375EF; border-radius: 5px; color: white; padding: 10px; margin-top: 20px; margin-bottom: 20px; text-decoration: none;">Download your file</a>`
      )
      .replace('{{sendFromEmail}}', sendFromEmail)
      .replace('{{sendToEmail}}', sendToEmail)
      .replace('{{fileDownloadLink}}', fileDownloadLink)
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


