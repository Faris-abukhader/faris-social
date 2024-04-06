import { type UserSession } from "@faris/server/module/auth/auth.handler";
import { useEffect } from "react";
import useSessionStore from "zustandStore/userSessionStore";


export default function SessionSaver({session}:{session:UserSession}) {
    const setSession = useSessionStore(state=>state.setSession)

    useEffect(()=>{
        session && setSession(session)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[session])

  return <></>
}
