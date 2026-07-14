import transporter from "../config/smtp";
import { ENV_CONFIG } from "../config/env.config";

type MailOptions = {
   to: string | string[],
   subject: string,
   html: string,
   cc?: string | string[],
   bcc?: string | string[],
   attachments?: any[]
};

const sendEmail = async (options: MailOptions) => {
    try{

        const mailOptions: MailOptions & { from: string }= {
            from: `HostelHub <${ENV_CONFIG.SMTP_USER}>`,
            to: options.to,
            subject : options.subject,
            html: options.html,
        };
        
        if(options.cc) {
            mailOptions['cc'] = options.cc;
        }

        if(options.bcc) {
            mailOptions['bcc'] = options.bcc;
        }

        if(options.attachments) {
            mailOptions['attachments'] = options.attachments;
        }

        await transporter.sendMail(mailOptions);

    }
    catch (error) {
        console.log(error)
    }
}

export default sendEmail;