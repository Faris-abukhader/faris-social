import { type UserSession } from '@faris/server/module/auth/auth.handler'
import { create } from 'zustand'

type Session = {
    user:UserSession,
    isReady:boolean,
    setSession:(user:UserSession|undefined)=>void,
    signOut:()=>void
}

const initalValue = {
    id:'',
    sessionId:'',
    email:'',
    image:'',
    thumbnailUrl:'',
    fullName: '',
    bio:null,
    coverImage:'',
    gettingStart:'',
    score: 0,
    gender:'',
    contentLanguage:'',
    platformLanguage:'',
    livingLocation: '',
    isVisiable:true,
    isPrivate:false,
    interestedTopics:[]    
}

const useSessionStore = create<Session>((set) => ({
    user:initalValue,
    isReady:false,
    setSession(user) {
        if(!!user && user!=null)set(state=>({...state,user,isReady:true}))
    },
    signOut() {
        set(state=>({...state,user:initalValue,isReady:false}))
    },
}))

export default useSessionStore;
