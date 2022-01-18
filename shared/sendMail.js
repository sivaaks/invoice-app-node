const nodeMailer= require('nodemailer');
const FROM_MAIL='diarymanagerr@gmail.com';
const SMTP_HOST='smtp.gmail.com';
const SMTP_PORT=465;

async function sendMail(to,subject,text,html){

    const from =FROM_MAIL;
    const transport= nodeMailer.createTransport({
        host:SMTP_HOST,
        port:SMTP_PORT,
        secure:true,
        auth:{
            user:FROM_MAIL,
            pass:'4DiaryManagerr@',
        },
    });
    let mail= transport.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });
    return await mail.messageId;
}

module.exports= sendMail;
