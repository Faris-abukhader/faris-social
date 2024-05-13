import Link from 'next/link'
import  { memo, useEffect, useState } from 'react'
import Image from 'next/image'
import { ScrollArea } from '@faris/components/ui/scroll-area'
import { Button } from '@faris/components/ui/button'
import { Card } from '@faris/components/ui/card'
import useSessionStore from 'zustandStore/userSessionStore'
import LeftMenuSekeleton from '@faris/components/skeleton/LeftMenuSekeleton'
import { useTranslation } from 'next-i18next';import { CreateNewEventModel, useEventModel } from '@faris/components/events/yourEvent/CreateNewEventModel'
import { usePageModel } from '@faris/components/pages/CreateNewPageModel'
import { EventCategories, helper, type ListType } from './menuHelper'
import { useGroupModel } from '@faris/components/groups/CreateNewGroupModel'
import useLocalizationStore from 'zustandStore/localizationStore'
import { ChevronLeftIcon } from 'lucide-react'

const LeftMenu = ({ type }: { type?: string }) => {

  const { t } = useTranslation()
  const { user: userSession, isReady } = useSessionStore(state => state)
  const [list, setList] = useState<ListType[]>([])
  const { setShow } = useEventModel(state => state)
  const showCreatePageModel = usePageModel(state => state.setShow)
  const showCreateGroupModel = useGroupModel(state => state.setShow)
  const [isLoading,setIsLoading] = useState(true)
  const language = useLocalizationStore(state=>state.language)

  useEffect(() => {
    if(isReady){
      setList(helper(type ?? 'main'))
      setIsLoading(false)
    }
  }, [isReady, type])


  return (
    <Card className={`max-h-screen w-1/3 max-w-[350px] hidden lg:block space-y-4 p-3 border-t-0 ${language=='ar'?'border-r-0':'border-l-0'} rounded-none`}>
      <ScrollArea className='h-screen pb-24'>
        {!isLoading ? <Link href={`/profile/${userSession.id}`}><div className='p-2  w-full hover:cursor-pointer  hover:bg-accent hover:text-accent-foreground rounded-md border-none shadow-none flex items-center gap-x-2'>
          <Image src={userSession.image ?? '/icons/profile.svg'} width={32} height={32} className='rounded-full w-8 h-8' alt='profile' />
          <h1 className=''>{userSession.fullName}</h1>
        </div>
        </Link>
          :
          <ul className=' space-y-4'>
            {Array.from({ length: 7 }).map((_, i) => <LeftMenuSekeleton key={i} />)}
            <div className="w-28 h-8 skeleton-background rounded"></div>
          </ul>}
        {!isLoading && list && list.length > 0 &&
          <ul className='pb-3'>
            {type!=undefined &&<li><Link href={`/`} className='flex hover:bg-accent hover:text-accent-foreground w-full items-center gap-x-3 p-2 rounded-md'>
              <ChevronLeftIcon/>
              <h1>{t('goBack')}</h1>
            </Link>
            </li>}
            {list.map(({ href, title, Icon }, index) => <li key={index}><Link href={href} className='flex hover:bg-accent hover:text-accent-foreground w-full items-center gap-x-3 p-2 rounded-md'>
              {Icon}
              <h1>{t(title)}</h1>
            </Link>
            </li>)}
          </ul>}
        {isReady && type == 'groups' && <Button onClick={()=>showCreateGroupModel(true)} size={'sm'}>{t('createNewGroup')}</Button>}
        {isReady && type == 'pages' && <Button onClick={()=>showCreatePageModel(true)} size={'sm'}>{t('createNewPage')}</Button>}
        {isReady && type == 'events' && <div>
          <Button size={'sm'} className='w-full' onClick={() => setShow(true)}>{t('createNewEvent')}</Button>
          <hr className='my-3' />
          <h1 className=' font-bold capitalize'>{t('categories')}</h1>
          {
            EventCategories.map(({ title, Icon }, index) => <div key={index}><Link href={`/events/filter/${title}`} className='flex hover:bg-accent hover:text-accent-foreground w-full items-center gap-x-3 p-2 rounded-md'>
              <div className='bg-accent text-accent-foreground rounded-full p-2'>{Icon}</div>
              <h1>{t(title)}</h1>
            </Link>
            </div>)}
          <CreateNewEventModel />
        </div>}
      </ScrollArea>
    </Card>
  )
}

export default memo(LeftMenu)