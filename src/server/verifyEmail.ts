import { resend } from "./resend"


export const sendVerifyEmail = async(to:string,token:string)=>{
    try{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Faris social | Verify your email',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            html: `<p>You almost there just <a ref="${process.env.BASE_URL!}/verify?token=${token}">click here</a> to verify your email , if it\'s you , just ignore this message. <br/> <p>or you can click on this link : ${process.env.BASE_URL!}/verify?token=${token}</p>`
          })    
    }catch(err){
        console.log(err)
        return err
    }
}

