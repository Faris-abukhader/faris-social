"use client"
import { type UserSession } from '@faris/server/module/auth/auth.handler'
import React, { useEffect } from 'react'
import useLocalizationStore from 'zustandStore/localizationStore'
import useMobileDetection from 'zustandStore/mobileDetection'
import useSessionStore from 'zustandStore/userSessionStore'

export default function StoresHelper({session,isMobile,language}:{session:UserSession|undefined,isMobile:boolean|undefined,language:string|undefined}) {
    const setSession = useSessionStore(state=>state.setSession)
    const setIsMobile = useMobileDetection(state=>state.setIsMobile)
    const setLanguage = useLocalizationStore(state=>state.setLanguage)

    useEffect(()=>{
        setSession(session)
    },[session,setSession])

    useEffect(()=>{
        setIsMobile(isMobile)
    },[isMobile, setIsMobile])

    useEffect(()=>{
        setLanguage(language)
    },[language,setLanguage])
    return <></>
}
