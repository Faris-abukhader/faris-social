import React from 'react'
import { Card } from '../../ui/card'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { type TGetOnePage } from '@faris/server/module/page/page.handler'
import { useTranslation } from 'next-i18next';import Link from 'next/link'
import { usePageListStore } from 'zustandStore/pageListStore'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import Loading from '@faris/components/general/Loading'
import CustomAvatar from '@faris/components/general/CustomAvatar'

export default function PageWidget({ id, coverImage, profileImage, title, _count, category,likeList }: TGetOnePage) {
  const { t } = useTranslation()
  const userId = useSessionStore(state=>state.user.id)
  const {likePage,disLikePage} = usePageListStore(state=>state)
  const {mutate,isLoading} = api.page.userPageProcedure.useMutation({
    onSuccess(data) {
      data.isLike ? likePage(id,userId):disLikePage(id)
    },
  })
  return (
    <Card className='pb-3'>
      <div className='w-full h-44 overflow-hidden'>
        <Image src={coverImage?.url ?? '/image/placeholder.png'} className='rounded-t-md  object-fill w-full h-full' width={600} height={800} alt='profile_image' />
      </div>
      <div className='p-2'>
        <div className='flex items-center gap-x-2 pb-2 sm:pb-1'>
        <CustomAvatar imageUrl={profileImage?.url} alt={`@${title}_profile_img`} />
          <div className='text-xs'>
            <Link href={`/page/${id}`} className='text-lg font-bold'>{title}</Link>
            <h4 className='opacity-80'>{t(category as string)}</h4>
            <h4 className='opacity-80'>{t('peopleLikePage', { number: _count?.likeList })}</h4>
          </div>
        </div>
        <Button onClick={()=>mutate({pageId:id,userId,isLike:likeList.length > 0?false:true})} size={'sm'} variant={'secondary'} className='w-full gap-x-1'>{isLoading ? <Loading/> :likeList.length > 0 ? <ThumbsDown className='w-3 h-3'/>:<ThumbsUp className='w-3 h-3' />}<span>{likeList.length > 0 ? t('dislike'):t('like')}</span> </Button>
      </div>
    </Card>
  )
}
