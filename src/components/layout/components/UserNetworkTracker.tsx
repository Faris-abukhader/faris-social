"use client"
import { api } from "@faris/utils/api"
import { useEffect } from "react"
import useSessionStore from "zustandStore/userSessionStore"
import { useNetworkStatus } from '@faris/hooks/useNetworkStatus'
import { useRouter } from "next/router"

const UserNetworkTracker = () => {
    const router = useRouter()
    const userId = useSessionStore(state => state.user.id)
    const isOnline = useNetworkStatus();
    const { mutate } = api.profile.setProfileOnline.useMutation()

    const exitingFunction = () => mutate({profileId:userId,isOnline:false})

    useEffect(() => {
        router.events.on("routeChangeStart", exitingFunction);
        window.onbeforeunload = exitingFunction;
    
        return () => {
          console.log("unmounting component...");
          router.events.off("routeChangeStart", exitingFunction);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log(isOnline)
    //         mutate({ profileId: userId, isOnline })
    //     }, 5_000);

    //     return () => {
    //         clearInterval(interval);
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isOnline, userId])
    return <></>
}

export default UserNetworkTracker;