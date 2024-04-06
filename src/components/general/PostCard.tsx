import { memo, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { BookmarkPlus, EyeOff, Globe, MessageSquare, MoreHorizontal, Share, ThumbsUp } from 'lucide-react'
import { Button } from '../ui/button'
import { type GetOnePost } from '@faris/server/module/post/post.handler'
import { useTranslation } from 'next-i18next';
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { usePostListStore } from 'zustandStore/postListStore'
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
import { type TGetOneMiniGroup } from '@faris/server/module/group/group.handler'
import { useToast } from '../ui/use-toast'
import Media from './Media'

type PostCardProps = {
  className?: string
  isBookmark?: boolean
  bookmarkId?: number
  group?: TGetOneMiniGroup
  page?: TGetOneMiniPage
} & GetOnePost

const PostCard = ({ id, type, className, userAuthor, pageAuthor, content, _count, createdAt, whoCanSee, commentList, likeList: LikeList, mediaList, checkIn, feeling, mentionList,hashtagList, isBookmark = false, bookmarkId = -1, group, page,language }: PostCardProps) => {
  const { t } = useTranslation()
  const userSession = useSessionStore(state => state.user)
  const { showModel, setShowModel, setPost: setSharePost } = useSharePostModel(state => state)
  const [likeList, setLikeList] = useState(_count?.likeList ?? 0)
  const [like, setLike] = useState(LikeList?.length == 1 ? true : false)
  const { likePost, dislikePost, profileId, deletePost } = usePostListStore(state => state)
  const { setPost, isExist } = usePostStore(state => state)
  const [feelingIcon, setFeelingIcon] = useState('')
  const { toast } = useToast()

  useMemo(() => {
    setFeelingIcon(feelingsList.find(item => item.feeling === feeling)?.icon ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLike(LikeList?.length == 1 ? true : false)
  }, [LikeList])

  const { mutate: likePostMutate } = api.post.likePost.useMutation({
    onSuccess(data) {
      data.action == 'like' ? setLikeList(likeList + 1) : setLikeList(likeList - 1)
      data.action == 'like' ? setLike(true) : setLike(false)
    },
  })

  const { mutate: addToBookmark, isLoading: isAddingToBookmark } = api.bookmark.addToBookmark.useMutation({
    onSuccess() {
      toast({
        title: t('postAddedToBookmark')
      })
    },
  })

  const { mutate: removeFromBookmark, isLoading: isRemovingToBookmark } = api.bookmark.removeFromBookmark.useMutation({
    onSuccess(data) {
      toast({
        title: t('postRemovedFromBookmark')
      })
      profileId === `bookmark.${userSession.id}` && deletePost(data.postId ?? '')
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

  const seeFullPost = () => setPost({ id, type, userAuthor, pageAuthor, content, _count, createdAt, commentList, mentionList, whoCanSee, likeList: LikeList,hashtagList, mediaList, checkIn, feeling,language }, false)

  const sharePostHandler = () => {
    setSharePost({ id, type, userAuthor, pageAuthor, content, _count, createdAt, commentList, mentionList, whoCanSee, likeList: LikeList, mediaList,hashtagList, checkIn, feeling,language }, false)
    setShowModel(true)
  }

  return (
    <>
      {isExist && <PostDialog />}
      {showModel && <SharePostModel />}
      <Card className={cn(className, `p-0 flex items-center`)}>
        <div className='w-full py-4'>
          <div className='flex items-center justify-between px-2 pb-3'>
            {group ? <div className='flex gap-x-2'>
              <div className='relative h-fit w-16'>
                <Image src={group.profileImage?.url ?? ''} className='rounded-md object-cover w-12 h-12' alt='profile' width={32} height={32} />
                <CustomAvatar className=' absolute -bottom-2 right-1 w-8 h-8 z-20' alt={page ? page?.title : userAuthor?.fullName ?? ''} imageUrl={page ? page.profileImage?.url : userAuthor?.image?.url} />
              </div>
              <div>
                <Link href={`/group/${group.id}`} className='hover:text-blue-700 transition-colors duration-500'>{group.title}</Link>
                <div className='flex items-center gap-x-2 text-xs'>
                  <span className='text-xs'>{fromNow(createdAt)}</span>
                  <Link href={`/profile/${userAuthor?.id ?? ''}`} className='font-bold hover:text-blue-700 transition-colors duration-500'>{userAuthor?.fullName}</Link>
                </div>
              </div>
            </div>
              :
              <div className='flex gap-x-2'>
                <CustomAvatar className='w-8 h-8' alt={page ? page.title : userAuthor?.fullName ?? ''} imageUrl={page ? page.profileImage?.url : userAuthor?.image?.url} />
                <div>
                  <div className='flex items-center gap-x-1'>
                    <Link href={pageAuthor ? `/page/${pageAuthor.id}` : `/profile/${userAuthor?.id ?? ''}`}>{pageAuthor ? pageAuthor.title : userAuthor?.fullName}</Link>
                    {checkIn && <div className="text-xs opacity-75">{t('at')}{' '}{checkIn?.location}</div>}
                    {feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` ${feelingIcon} `}{t(feeling)}</div>}
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <span className='text-xs'>{fromNow(createdAt)}</span><Globe className='w-3 h-3' />
                  </div>
                </div>
              </div>
            }
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
          {mediaList != undefined && mediaList?.length > 0 && mediaList?.map((img, i) => <Media key={i} src={img.url} isToxic={img.isToxic || true}/>)}
          {/* image grid */}
          <div className='px-2 text-xs pt-4'>
            <div className='flex items-center justify-between pb-2 border-b'>
              <h1>{_count?.likeList} {t('likes')}</h1>
              <div className='flex items-center gap-x-3'>
                <h1>{_count?.commentList} {t('comments')}</h1>
                <h1>{_count?.sharedList} {t('shares')}</h1>
              </div>
            </div>
            <div className='flex items-center justify-between py-1 border-b'>
              <Button onClick={() => { likePostMutate({ postId: id, like: !like, userId: userSession.id, isSharedPost: false }), like ? dislikePost(id, userSession.id) : likePost(id, userSession.id) }} variant={'ghost'} className='gap-x-1  scale-90'>
                <ThumbsUp className={`w-4 h-4 ${like ? 'fill-red-600 text-red-600' : ''} transition-colors duration-500`} />
                <span className='text-xs capitalize'>{t('like')}</span>
              </Button>
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