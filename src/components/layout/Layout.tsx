import { memo, type ReactNode } from 'react'
import Navbar from './components/Navbar'
import LeftMenu from './components/LeftMenu'
import RightMenu from './components/RightMenu'
import { ScrollArea } from '../ui/scroll-area'
import Head from 'next/head'
import Offcanva from './components/Offcanva'
import { type UserSession } from '@faris/server/module/auth/auth.handler'
import { cn } from '@faris/utils/tailwindHelper'
import UserNetworkTracker from './components/UserNetworkTracker'
import StoryGallary from '../story/StoryGallary'
import { Toaster } from '../ui/toaster'
import StoresHelper from '../general/StoresHelper'
import useLocalizationStore from 'zustandStore/localizationStore'

interface Props {
  title?: string,
  description?: string
  children: ReactNode,
  showLeftMenu?: boolean,
  showRightMenu?: boolean,
  type?: string,
  className?: string
  showSearchingBar?: boolean
  session?: UserSession | null
  isMobile?:boolean
  locale?:string
}


const Layout = ({ children, title = 'Faris social', description = 'welcome to faris social app', showLeftMenu = true, showRightMenu = true, type, className, showSearchingBar, session,isMobile,locale }: Props) => {
  const lang = useLocalizationStore(state=>state.language)
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StoryGallary />
      <StoresHelper session={session??undefined} isMobile={isMobile} language={locale}/>
      <div dir={locale !== undefined && locale === 'ar' ? 'rtl' : lang === 'ar' ? 'rtl' : 'ltr'} className="-pb-20">
        <div className='bg-zinc-50 dark:bg-black  max-h-screen'>
          <Navbar showSearchingBar={showSearchingBar} />
          <div className='flex fixed left-0 top-[64px] w-full items-start justify-between'>
            {showLeftMenu && <LeftMenu type={type} />}
            <div className={`w-full max-h-screen flex items-start justify-center ${showRightMenu ? 'lg:justify-center' : 'lg:justify-center'} scrollbar-hide p-0`}>
              <ScrollArea className={cn(`w-full px-2 sm:px-8 pb-8 h-[screen] scrollbar-hide`, className)}>
                {children}
              </ScrollArea>
            </div>
            {showRightMenu && <RightMenu />}
          </div>
          <Offcanva type={type ?? ''} />
          <UserNetworkTracker />
          <Toaster />
        </div>
      </div>
    </>
  )
}

export default memo(Layout)