import { useEffect, type ReactNode } from 'react'
import Navbar from '@faris/components/layout/components/Navbar'
import LeftMenu from '@faris/components/layout/components/LeftMenu'
import RightMenu from '@faris/components/layout/components/RightMenu'
import { ScrollArea } from '../ui/scroll-area'
import MobileNavbar from './MobileNavbar'
import useSessionStore from 'zustandStore/userSessionStore'
import { type UserSession } from '@faris/server/module/auth/auth.handler'

export default function Layout({children,type,session,isMobile}:{children:ReactNode,type?:string,session:UserSession,isMobile:boolean}) {
  
  const {isReady,setSession} = useSessionStore(state=>state)
  useEffect(()=>{
    if(!isReady && session)setSession(session)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='max-h-screen'>
        {isMobile ?
         <MobileNavbar/>
         :
         <Navbar/>
        }
        <div className={`flex fixed left-0 ${isMobile ? '':'top-[64px]'} w-full items-start justify-between`}>
        <LeftMenu type={type}/>
        <div className={`w-full max-h-screen flex items-start justify-center scrollbar-hide`}>
          <ScrollArea className={`w-full max-w-5xl h-screen scrollbar-hide`}>
          {children}
          </ScrollArea>
        </div>
       <RightMenu/>
        </div>
        {/* <Offcanva/> */}
    </div>
  )
}
