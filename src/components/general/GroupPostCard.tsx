import { memo, useMemo, useState } from 'react'
import Image from 'next/image'
import { BookmarkPlus, ChevronsDown, ChevronsUp, EyeOff, MessageSquare, MoreHorizontal, Share } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import feelingsList from '@faris/utils/postFeeling'
import WriteComment from './WriteComment'
import CommentNode from '../post/CommentNode'
import usePostStore from 'zustandStore/postStore'
import PostDialog from '../post/PostDialog'
import { SharePostModel, useSharePostModel } from '../post/SharePostModel'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@faris/components/ui/dropdown-menu'
import Loading from './Loading'
import Link from 'next/link'
import CustomAvatar from './CustomAvatar'
import fromNow from '@faris/utils/fromNow'
import { type TGetOneMiniPage } from '@faris/server/module/page/page.handler'
import { Card } from '../ui/card'
import { cn } from '@faris/utils/tailwindHelper'
import { type TGetOneGroupPost, type TGetOneMiniGroup } from '@faris/server/module/group/group.handler'
import { useGroupPostListStore } from 'zustandStore/groupPostListStore'
import { useToast } from '../ui/use-toast'

type PostCardProps = {
  className?: string
  isBookmark?: boolean
  bookmarkId?: number
  group: TGetOneMiniGroup
  page?: TGetOneMiniPage
} & TGetOneGroupPost

const PostCard = ({ id, type, className, userAuthor, content, _count, createdAt, whoCanSee, commentList, mediaList, checkIn, feeling, mentionList,hashtagList, isBookmark = false, bookmarkId = -1, group, page, votingDown, votingUp,language }: PostCardProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const userSession = useSessionStore(state => state.user)
  const { showModel, setShowModel, setPost: setSharePost } = useSharePostModel(state => state)
  const { setPost, isExist } = usePostStore(state => state)
  const { votingProcedure, deletePost } = useGroupPostListStore(state => state)
  const [feelingIcon, setFeelingIcon] = useState('')
  const { mutate: addToBookmark, isLoading: isAddingToBookmark } = api.bookmark.addToBookmark.useMutation({
    onSuccess() {
      toast({
        title: t('postAddedToBookmark')
      })
    },
  })
  const { mutate: removeFromBookmark, isLoading: isRemovingToBookmark } = api.bookmark.removeFromBookmark.useMutation({
    onSuccess() {
      toast({
        title: t('postRemovedFromBookmark')
      })
    },
  })
  const { mutate: votingMutate, isLoading: isVoting } = api.group.voting.useMutation({
    onSuccess(data) {
      votingProcedure(id, userSession.id, data.voting == 'up')
    },
  })

  const { mutate: hidePost, isLoading: isHidding } = api.post.hideOne.useMutation({
    onSuccess(data) {
      deletePost(data.postId)
      toast({
        title: t('postHidedSuccessfully')
      })
    },
  })


  const seeFullPost = () => setPost({ id, type, userAuthor, pageAuthor: null, content, _count, createdAt, commentList, mentionList, whoCanSee,hashtagList, likeList: [], mediaList, checkIn, feeling,language }, false)

  const sharePostHandler = () => {
    setSharePost({ id, type, userAuthor, pageAuthor: null, content, _count, createdAt, commentList, mentionList, whoCanSee, likeList: [],hashtagList, mediaList, checkIn, feeling,language }, false)
    setShowModel(true)
  }

  useMemo(() => {
    setFeelingIcon(feelingsList.find(item => item.feeling === feeling)?.icon ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isExist && <PostDialog />}
      {showModel && <SharePostModel />}
      <Card className={cn(className, `p-0 flex items-center`)}>
        <div className='h-full p-1'>
          <section className='h-full'>
            <Button disabled={isVoting} onClick={() => votingMutate({ groupId: group.id, postId: id, userId: userSession.id, voting: 'up' })} size={'sm'} className='rounded-full w-7 h-7 p-0' variant={'ghost'}><ChevronsUp className='w-4 h-4' /></Button>
            {isVoting ? <Loading className='mx-auto w-3 h-3' /> : <h1 className='text-xs text-center font-bold'>{votingUp.length - votingDown.length}</h1>}
            <Button disabled={isVoting} onClick={() => votingMutate({ groupId: group.id, postId: id, userId: userSession.id, voting: 'down' })} size={'sm'} className='rounded-full  w-7 h-7 p-0' variant={'ghost'}><ChevronsDown className='w-4 h-4' /></Button>
          </section>
        </div>
        <div className='w-full py-4 border-l'>
          <div className='flex items-center justify-between px-2 pb-3'>
            <div className='flex gap-x-2'>
              <div className='relative h-fit w-16'>
                <Image src={group.profileImage?.url ?? ''} className='rounded-md object-cover w-12 h-12' alt='profile' width={32} height={32} />
                <CustomAvatar className=' absolute -bottom-2 right-1 w-8 h-8 z-20' alt={page ? page?.title : userAuthor?.fullName ?? ''} imageUrl={page ? page.profileImage?.url : userAuthor?.image?.url} />
              </div>
              <div>
                <Link href={`/group/${group.id}`} className='hover:text-blue-700 transition-colors duration-500'>{group.title}</Link>
                <div className='flex items-center gap-x-2 text-xs'>
                  <span className='text-xs'>{fromNow(createdAt)}</span>
                  <Link href={`/profile/${userAuthor?.id ?? ''}`} className='font-bold hover:text-blue-700 transition-colors duration-500'>{userAuthor?.fullName}</Link>
                  {checkIn && <div className="text-xs opacity-75">{t('at')}{' '}{checkIn?.location}</div>}
                  {feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` ${feelingIcon} `}{feeling}</div>}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isAddingToBookmark || isRemovingToBookmark || isHidding ? <Loading /> : <Button variant={'ghost'}>
                  <MoreHorizontal />
                </Button>}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => isBookmark ? removeFromBookmark({ id: bookmarkId }) : addToBookmark({ ownerId: userSession.id, postId: id, isSharedPost: false })}>
                  <BookmarkPlus className='w-4 h-4' />
                  <span>{isBookmark ? t('removeFromBookmark') : t('addToBookmark')}</span>
                </DropdownMenuItem>
                {userAuthor && userSession.id != userAuthor.id && <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => hidePost({ postId: id, ownerId: userSession.id })}>
                  <EyeOff className='w-4 h-4' />
                  <span>{t('hidePost')}</span>
                </DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='text-xs px-3 py-3'>
          <p dir={language?.code=='ar'?'rtl':'ltr'} onClick={seeFullPost}>{content}</p>
          <br/>
          {hashtagList.map((hashtag,i)=><span className='text-blue-400 hover:bg-accent rounded-md p-1' key={i}><Link href={`/search?query=${hashtag.title.slice(1)}&tap=hashtag`}>{hashtag.title}</Link></span>)}
          </div>
          {mediaList != undefined && mediaList?.length > 0 && mediaList?.map((img, i) => <Image onClick={seeFullPost} key={i} src={img.url} width={500} height={500} className='w-full h-96 rounded-md' alt='post_image' />)}
          {/* image grid */}
          <div className='px-2 text-xs pt-4'>
            <div className='flex items-center justify-end pb-2 border-b'>
              <div className='flex items-center gap-x-3'>
                <h1>{_count?.commentList} {t('comments')}</h1>
                <h1>{_count?.sharedList} {t('shares')}</h1>
              </div>
            </div>
            <div className='flex items-center justify-between py-1 border-b'>
              <Button variant={'ghost'} className='gap-x-1  scale-90' onClick={seeFullPost}>
                <MessageSquare className='w-4 h-4' />
                <span className='text-xs capitalize'>{t('comment')}</span>
              </Button>
              <Button variant={'ghost'} className='gap-x-1  scale-90' onClick={sharePostHandler}>
                <Share className='w-4 h-4' />
                <span className='text-xs capitalize'>{t('share')}</span>
              </Button>
            </div>
          </div>
          <div onClick={seeFullPost}>
            {commentList && commentList.length > 0 && commentList.map((comment, index) => <CommentNode key={index} {...comment} />)}
            <WriteComment postId={id} isSharedPost={false} />
          </div>
        </div>
      </Card>
    </>
  )
}

export default memo(PostCard);
