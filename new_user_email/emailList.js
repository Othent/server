import nodemailer from 'nodemailer';
import alert from '../database/alert.js'


export default async function emailList (email) {
    await alert('email subscription', email)


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.nodemailer_email,
          pass: process.env.nodemailer_password,
        },
      });
    
      let template = await fetch('https://othent.io/email-list.html');
      template = await template.text()
    
      const message_to = {
        from: process.env.nodemailer_email,
        to: email,
        subject: `Othent.io email subscription confirmation : ` + email,
        html: template.replace('{{email}}', email)
      };
      transporter.sendMail(message_to, (error, info) => {
        if (error) {
          console.log(error, info);
          throw new Error(error);
        } else {
          return 'Email sent';
        }
      });



}