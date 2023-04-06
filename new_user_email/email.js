import nodemailer from 'nodemailer';


export default async function sendEmail(email, contract_id) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });


  let template_to = await fetch('https://othent.io/email-template-to.html');
  template_to = await template_to.text()
  const message_to = {
    from: process.env.nodemailer_email,
    to: email,
    subject: `Othent.io account confirmation : ` + email,
    html: template_to.replace('{{message}}', contract_id + email)
  };
  transporter.sendMail(message_to, (error, info) => {
    if (error) {
      console.log(error, info);
      throw new Error(error);
    } else {
      return 'Email sent';
    }
  });


};


