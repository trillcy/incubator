import { type EmailBody } from '../types/types'
import nodemailer from 'nodemailer'

export const emailManager = {
  async sendEmailConfirmationMessage(emailObject: EmailBody): Promise<any> {
    // ==========
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'andreiincubator@gmail.com',
        pass: 'uggx ujbd rsfr zzun',
      },
    })

    async function main() {
      const info = await transporter.sendMail({
        from: 'andreiincubator@gmail.com', // sender address
        to: emailObject.email, // list of receivers
        subject: emailObject.subject, // Subject line
        // text: 'Hello world?', // plain text body
        html: emailObject.message, // html body
      })

      return info
    }

    return await main().catch(console.error)
    // ==========
  },
}
