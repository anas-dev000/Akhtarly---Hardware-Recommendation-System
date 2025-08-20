const nodemailer = require('nodemailer');

//function to send email to reset password

const sendEmail = async (option) => {
    //Craate the transporter 
    const transporter = nodemailer.createTransport({
        service : "gmail",
        //host : process.env.EMAIL_HOST,
        //port : process.env.EMAIL_PORT,
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASWORD,
        }
    });

    //Define Email Option
    const emailOptions = {
        //from : "Cineflix support<support@cineflix.com>",
        from :"algebalyanas@gmail.com",
        to : option.email,
        subject : option.subject,
        text : option.massage
    }

   await transporter.sendMail(emailOptions,function(error,info){
    if(error){
        console.log(`error in send email : ${error}`);
    }else{
        console.log(`Email has been sent :)  :: ${info.response} `);
    }
   });
}

module.exports = sendEmail;