import { Input } from '../ui/input'
import useSessionStore from 'zustandStore/userSessionStore'
import { useTranslation } from 'next-i18next';
import { AddPostModel, type Author, type Holder, usePostModel } from './AddPostModel'
import { Videotape, ImageIcon, Smile } from 'lucide-react'
import CreatePostWidgetSkeleton from '../skeleton/CreatePostWidgetSkeleton'
import CustomAvatar from '../general/CustomAvatar'
import { type TGetOneMiniPage } from '@faris/server/module/page/page.handler'

interface CreatePostCardProps {
  authorType?: Author,
  holderType?: Holder
  page?:TGetOneMiniPage
  groupId?:string
  pageId?:string
}

export default function CreatePostCard({authorType,holderType,page,groupId,pageId}:CreatePostCardProps) {
  const { t } = useTranslation()
  const { user, isReady } = useSessionStore(state => state)
  const {setShowModel} = usePostModel(state=>state)

  if (!isReady)return <CreatePostWidgetSkeleton/> 

  const IconList = [
    {
      icon:<Videotape className='w-4 h-4' />,
      label:'liveVideo'
    },
    {
      icon:<ImageIcon className='w-4 h-4' />,
      label:'Photo/video'
    },
    {
      icon:<Smile className='w-4 h-4' />,
      label:'Feeling/activities'
    },
  ]

  return (
    <>
    <div className='bg-popover text-popover-foreground shadow-sm border p-3 rounded-md hover:cursor-pointer' onClick={()=>setShowModel(true,authorType,holderType,page,groupId,pageId)}>
      <div className='border-b pb-2 flex items-center gap-x-2'>
        <CustomAvatar className='w-9 h-9' alt={page ? page.title:user.fullName} imageUrl={page ? page.profileImage?.url:user.image??undefined}/>
        <Input placeholder={t('whatOnYourMind', { username: page ? page.title:user.fullName })} className='rounded-3xl' />
      </div>
      <div className='w-full flex items-center justify-between py-4'>
        {IconList.map((icon,i)=><div key={i} className='flex items-center gap-x-1 px-1 text-xs'>
          {icon.icon}
          <span>{t(icon.label)}</span>
        </div>)}
      </div>
    </div>
    <AddPostModel/>
    </>
  )
}
