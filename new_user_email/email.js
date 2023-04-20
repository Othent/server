import nodemailer from 'nodemailer';


export default async function sendEmail(email, contract_id, given_name) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });


  let template_to = await fetch('https://othent.io/othent-comfirmation.html');
  template_to = await template_to.text()
  console.log(template_to)
  const message_to = {
    from: process.env.nodemailer_email,
    to: email,
    subject: `Othent.io account confirmation : ` + email,
    html: template_to.replace('{{given_name}}', given_name).replace('{{contract_id}}', contract_id)
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


