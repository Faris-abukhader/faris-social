import  { memo } from 'react'
import { Button } from '../ui/button'
import { MessageSquarePlus, Send, ThumbsDown, ThumbsUp } from 'lucide-react'
import { type TGetOnePage } from '@faris/server/module/page/page.handler'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import ImageCover from '../general/ImageCover'
import ImageProfile from '../general/ImageProfile'
import Link from 'next/link'
import CustomAvatar from '../general/CustomAvatar'
import { usePostListStore } from 'zustandStore/postListStore'
import { useTranslation } from 'next-i18next';import InviteFriendModel, { useFriendInvitationModel } from '../general/invitation/InviteFriendModel'
import QRcodeReviewer from '../general/QRcodeReviewer'
import { useToast } from '../ui/use-toast'

const PageHeader = ({ id, coverImage, owner, profileImage, title, _count, likeList }: TGetOnePage) => {
  const {t} = useTranslation()
  const {toast} = useToast()
  const userId = useSessionStore(state => state.user.id)
  const showInvitationModel = useFriendInvitationModel(state => state.setOpen)
  const {isPageLiked,setIsPageLiked,conversationId} = usePostListStore(state=>state)
  const { mutate: coverMutation } = api.page.changeCover.useMutation()
  const { mutate: profileMutation } = api.page.changeProfile.useMutation()
  const { mutate: userPageProcedure } = api.page.userPageProcedure.useMutation({
    onSuccess(data) {
      setIsPageLiked(data.isLike)
      if(data.isLike){
        toast({
          title:t('pageLikedSuccessfully')
        })
      }
    },
  })

  return (
    <div className='w-full'>
      <ImageCover id={id} isOwner={userId == owner?.id} coverImage={coverImage} mutate={coverMutation} />
      <div className='flex-row md:flex space-y-4 md:space-y-0 items-center justify-between py-6 '>
        <div className='flex-row space-y-5 sm:space-y-0 sm:flex items-center gap-x-4'>
          <ImageProfile id={id} image={profileImage} isOwner={userId == owner?.id} mutate={profileMutation} />
          <div className='sm:-mt-4'>
            <h1 className='font-bold text-2xl sm:text-lg'>{title}</h1>
            <p className='hidden sm:block text-xs'>{t('peopleLikePage', { number: _count?.likeList })}</p>
            <ul className='hidden sm:flex -gap-x-3'>
              {likeList && likeList.length > 0 && likeList.map((user, index) => <Link href={`/profile/${user.id}`} key={index}>
                <CustomAvatar imageUrl={user?.image?.url} alt={user?.fullName} />
              </Link>)}
            </ul>
          </div>
        </div>
        <div className='flex items-center justify-end sm:justify-start gap-x-2'>
          <Button onClick={() => showInvitationModel(id,'page')} className='w-full sm:w-fit gap-x-1'>
            <Send className='w-3 h-3' />
            <span>{t('inviteFriend')}</span>
          </Button >
          <Button onClick={()=>userPageProcedure({pageId:id,userId,isLike:!isPageLiked})} className='w-full sm:w-fit gap-x-1'>
            {isPageLiked ? <ThumbsDown className='w-3 h-3'/>:<ThumbsUp className='w-3 h-3' />}
            <span>{isPageLiked?t('dislike'):t('like')}</span>
          </Button>
          <Link href={conversationId!=-1?`/messages?conversation=${conversationId}`:`/messages?contactId=${id}_page`}>
          <Button variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
            <MessageSquarePlus className='w-3 h-3' />
            <span>{t('sendMessage')}</span>
          </Button>
          </Link>
          <QRcodeReviewer path={id} target='page'/>
        </div>
      </div>
      <InviteFriendModel />
    </div>
  )
}

export default memo(PageHeader)