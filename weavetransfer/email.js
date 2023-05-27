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
  let template_to = await fetch('https://othent.io/templates/WT-to.html');
  template_to = await template_to.text()
  const message_to = {
    from: process.env.nodemailer_email_WT,
    to: sendToEmail,
    subject: `${sendFromEmail} has sent you a file - via WeaveTransfer`,
    html: template_to
      .replace('{{sendFromEmail}}', sendToEmail)
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
  let template_from = await fetch('https://othent.io/templates/WT-from.html');
  template_from = await template_from.text()
  const message_from = {
    from: process.env.nodemailer_email_WT,
    to: sendFromEmail,
    subject: `Your file to ${sendToEmail} has been sent - via WeaveTransfer`,
    html: template_from
      .replace('{{sendToEmail}}', sendFromEmail)
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


