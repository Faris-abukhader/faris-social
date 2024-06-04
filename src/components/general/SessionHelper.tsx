"use client";
import { memo, useEffect, useState } from 'react'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import useLocalizationStore from 'zustandStore/localizationStore';

const SessionHelper = ()=> {
    const { isReady, setSession } = useSessionStore(state => state)
    const setLanguage = useLocalizationStore(state=>state.setLanguage)
    const [dummy,setDummy] = useState(0)
    const { mutate } = api.auth.getSession.useMutation({
        onError(error) {
            if(error){
                setDummy(-1)
            }
        },
        onSuccess(data) {
            setSession(data)
            setLanguage(data.platformLanguage)
        },
    })

    useEffect(() => {
        if(dummy==-1)return
        const incrementInterval = 500; // Increment every 500ms

        const interval = setInterval(() => {
        if (!isReady) {
            mutate()
            setDummy(dummy+1)
            clearInterval(interval);
           } 
        }, incrementInterval);

        return () => {
        clearInterval(interval);
        };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummy,isReady]);


    return <></>
}

export default memo(SessionHelper)