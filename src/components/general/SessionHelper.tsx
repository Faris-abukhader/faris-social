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
        onSuccess(data) {
            console.log(data)
            setSession(data)
            setLanguage(data.platformLanguage)
        },
    })

    useEffect(() => {
        const incrementInterval = 500; // Increment every 500ms

        console.log('hello from session helper')

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
  }, [dummy]);


    return <></>
}

export default memo(SessionHelper)