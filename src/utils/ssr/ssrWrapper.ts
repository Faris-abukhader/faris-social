import { type UserSession } from "@faris/server/module/auth/auth.handler";
import { type GetServerSidePropsContext } from "next";

export const ssrWrapper = async (ctx: GetServerSidePropsContext) => {

  const start = performance.now()

  const { getIronSession } = await import("iron-session");
  const { sessionOptions } = await import("@faris/utils/session");
  const mobileDetection = (await import("@faris/utils/mobileDetection")).default;
  const { RedirectException } = await import("./redirectException");
  const { useUrlHistoryStore } = await import("zustandStore/urlHistoryStore");
  const user = (await import('zustandStore/userSessionStore')).default
  const mobile = (await import('zustandStore/mobileDetection')).default
  const localization = (await import('zustandStore/localizationStore')).default
  const redis = (await import("@faris/server/redis")).default;
  const userAgent = ctx.req?.headers['user-agent']

  let sessionTemp = null

  // determine whether the request is from phone or not
  const isMobile = mobileDetection(userAgent as string)
  mobile.getState().setIsMobile(isMobile)

  // getting locale , if it not exist we take the default one
  const locale = ctx.locale ?? ctx.defaultLocale ?? 'en'

  // getting iron session 
  const session = await getIronSession(ctx.req, ctx.res, sessionOptions)


  // if the client side session id expired redirect the user to sign in page
  if (!session || !session.user?.sessionId) {
    throw new RedirectException('/auth/sign-in');
  }

  // check if the user session still exist in app memory (zustand store)
  if (user.getState().isReady && user.getState().user.sessionId == session.user.sessionId) {
    console.log('zustand session is exist')
    sessionTemp = user.getState().user

  } else {
    console.log('zustand session is not exist')
    // if there is no session found in zustand session
    // getting session token from cache
    try{
      const cacheSession = await redis.get(session.user.sessionId) as string

      // if the session cache is not found remove the local session and redirect to sign in page
      if (!cacheSession) {
        session.destroy()
        throw new RedirectException('/auth/sign-in');
      }
  
      // verifying session token and get session object form it
      const userSession = JSON.parse(JSON.stringify(cacheSession)) as UserSession
  
      // assigning session to return it with props
      sessionTemp = userSession
      user.getState().setSession(sessionTemp)
      localization.getState().setLanguage(sessionTemp.platformLanguage ?? locale)
  
  
        // check if the user did not finish getting start steps then throw a redirect error
        if (sessionTemp.gettingStart != 'c') {
          throw new RedirectException(`/getting-start/${sessionTemp.gettingStart}`);
        }
    }catch(err){

      console.log(err)
      console.log('redis error')
     
    }

  }


  const end = performance.now()
  console.log(`time taken to fetch ssr wrapper is ${(end - start) / 1000}sec`)

  // save the current url 
  // we use this for post route for redirect 
  useUrlHistoryStore.getState().setUrl(ctx.resolvedUrl)

  return {
    isMobile,
    locale,
    session: sessionTemp
  }

}

export type SSRprops = Awaited<ReturnType<typeof ssrWrapper>>