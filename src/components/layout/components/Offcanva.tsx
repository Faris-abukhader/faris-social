import  { memo, useEffect, useState } from 'react'
import { Button } from "@faris/components/ui/button"
import {
  Sheet,
  SheetContent,
} from "@faris/components/ui/sheet"
import { ScrollArea } from '@faris/components/ui/scroll-area'
import Image from 'next/image'
import Link from 'next/link'
import useOffcanva from 'zustandStore/OffcanvaStore'
import useSessionStore from 'zustandStore/userSessionStore'
import LeftMenuSekeleton from '@faris/components/skeleton/LeftMenuSekeleton'
import { type ListType,EventCategories, helper } from './menuHelper'
import { useTranslation } from 'next-i18next';import { usePageModel } from '@faris/components/pages/CreateNewPageModel'
import { useGroupModel } from '@faris/components/groups/CreateNewGroupModel'
import useLocalizationStore from 'zustandStore/localizationStore'

const Offcanva = ({type}:{type:string})=> {
  const {open,toggle,setOpen} = useOffcanva(state=>state)
  const {user,isReady} = useSessionStore(state=>state)
  const [list, setList] = useState<ListType[]>([])
  const {t} = useTranslation()
  const showCreatePageModel = usePageModel(state => state.setShow)
  const showCreateGroupModel = useGroupModel(state => state.setShow)
  const language = useLocalizationStore(state=>state.language)

  useEffect(() => {
    isReady && setList(helper(type ?? 'main'))
  }, [isReady, type])

  return (
    <Sheet onOpenChange={toggle} open={open}>
      <SheetContent side={language=='ar'?'left':'right'} className='w-full sm:max-w-sm'>
      <ScrollArea className='h-screen pt-6'>
        {isReady ? <Link href={`/profile/${user.id}`}><div className='p-2  w-full hover:cursor-pointer  hover:bg-accent hover:text-accent-foreground rounded-md border-none shadow-none flex items-center gap-x-2'>
          <Image src={user.image ?? '/icons/profile.svg'} width={32} height={32} className='rounded-full' alt='profile' />
          <h1 className=''>{user.fullName}</h1>
        </div>
        </Link>
          :
          <ul className=' space-y-4'>
            {Array.from({ length: 7 }).map((_, i) =><LeftMenuSekeleton key={i}/>)}
            <div className="w-28 h-8 skeleton-background rounded"></div>
          </ul>}
          <ul className='pb-3'>
        {isReady && list.map(({ href, title, Icon }, index) => <div key={index}><Link href={href} onClick={()=>setOpen(false)} className='flex hover:bg-accent hover:text-accent-foreground w-full items-center gap-x-3 p-2 rounded-md'>
          {Icon}
          <h1>{t(title)}</h1>
        </Link>
        </div>)
        }
        </ul>
        {isReady && type == 'events' && <div>
          <hr className='my-3' />
          <h1 className=' font-bold'>{t('categories')}</h1>
          {
            EventCategories.map(({ title, Icon }, index) => <div key={index}><Link href={`/events/filter/${title}`} className='flex hover:bg-accent hover:text-accent-foreground w-full items-center gap-x-3 p-2 rounded-md'>
              <div className='bg-accent text-accent-foreground rounded-full p-2'>{Icon}</div>
              <h1>{t(title)}</h1>
            </Link>
            </div>)}
        </div>}
        {isReady && type == 'groups' && <Button onClick={()=>showCreateGroupModel(true)} size={'sm'}>{t('createNewGroup')}</Button>}
        {isReady && type == 'pages' && <Button onClick={()=>showCreatePageModel(true)} size={'sm'}>{t('createNewPage')}</Button>}
      </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default memo(Offcanva)