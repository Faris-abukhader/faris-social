import { type GetServerSidePropsContext } from 'next'
import {sessionObjectGenerator, type UserSession, type UserSessionAttributes} from '@faris/server/module/auth/auth.handler'
import SessionSaver from '@faris/components/gettingStart/SessionSaver'

import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const FirstStep = dynamic(()=>import('@faris/components/gettingStart/FirstStep'))
const SecondStep = dynamic(()=>import('@faris/components/gettingStart/SecondStep'))
const ThirdStep = dynamic(()=>import('@faris/components/gettingStart/ThirdStep'))

interface StepPageProps {
  step:string,
  session:UserSession
}

export default function Step({step,session}:StepPageProps) {

  const viewRender = ()=>{
    switch(step){
      case '1':
        return <FirstStep/>
      case '2':
        return <SecondStep/>
      case '3':
        return <ThirdStep/>
      default:
        return <FirstStep/>
    }
  }

  return <>
  <SessionSaver session={session}/>
  {viewRender()}
  </>
}

export const getServerSideProps = async(ctx:GetServerSidePropsContext)=>{

  const {query,locale} = ctx
  const {step} = query

  const { getIronSession }  = await import("iron-session");
  const { sessionOptions } = await import ("@faris/utils/session");
  const redis = (await import("@faris/server/redis")).default;


  // getting iron session 
  const session = await getIronSession(ctx.req,ctx.res,sessionOptions)

  // if the client side session id expired redirect the user to sign in page
  if(!session || !session.user){
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false
      },
      props: {}
    }
  }

  // getting session token from cache
  const cacheSession = await redis.get(session.user.sessionId) as string

  // if the session cache is not found remove the local session and redirect to sign in page
  if(!cacheSession){

      session.destroy()

      return {
        redirect: {
          destination: '/auth/sign-in',
          permanent: false
        },
        props: {}
      }
  }


// verifying session token and get session object form it
const userSession = JSON.parse(JSON.stringify(cacheSession)) as UserSessionAttributes

// if user already finish his registeration step redirect him to account main page
if (userSession.gettingStart=='c'){
  return {
    redirect: {
      destination: `/`,
      permanent: false
    }
  }
}

// check if the current step is valid with step at session
if(step?.at(0) != userSession.gettingStart){
  return {
    redirect: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      destination: `/getting-start/${userSession.gettingStart}`,
      permanent: false
    }
  }
}

return{
  props:{
    session:sessionObjectGenerator(userSession),
    step:String(step),
    ...(await serverSideTranslations(locale??'en')),
  }
}
}
