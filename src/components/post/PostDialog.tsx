import { useMemo, useState } from 'react'
import { Globe, MessageSquare, MoreHorizontal, Share, ThumbsUp } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { usePostListStore } from 'zustandStore/postListStore'
import feelingsList from '@faris/utils/postFeeling'
import WriteComment from '@faris/components/general/WriteComment'
import CommentNode from '@faris/components/post/CommentNode'
import usePostStore from 'zustandStore/postStore'
import { Dialog, DialogContent } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import CustomAvatar from '../general/CustomAvatar'
import fromNow from '@faris/utils/fromNow'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import useMobileDetection from 'zustandStore/mobileDetection'
import { Drawer, DrawerContent } from '@faris/components/ui/drawer'
import Media from '../general/Media'

// todo ...
// need to update the drawer if there is scroll area
// check is mobile
export default function PostDialog() {
  const { t } = useTranslation()
  const isMobile = useMobileDetection(state=>state.isMobile)
  const userSession = useSessionStore(state => state.user)
  const { likePost, dislikePost } = usePostListStore(state => state)
  const [feelingIcon, setFeelingIcon] = useState('')
  const {
    post,
    show,
    setShow,
    loadMoreComment,
    setTotalCommentPage,
    currentCommentPageNumber,
    setCurrentCommentPageNumber,
    userLikeIt,
    setUserLikeIt,
    likePost:LikePost,
    dislikePost:DislikePost,
    isSharedPost,
  } = usePostStore((state) => state);

  const { mutate } = api.post.getCommentList.useMutation({
    onSuccess(data) {
      // double check the total comment page 
      // since first request we don't know how much , so we keep it 1 as default
      // until we got if from backend
      setTotalCommentPage(data.pageNumber)
      // load the new comment and assign it into post inside zustand
      loadMoreComment(data.data.commentList)
    },
  })

  useMemo(() => {
    setFeelingIcon(feelingsList.find(item => item.feeling === post?.feeling)?.icon ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const { mutate: likePostMutate } = api.post.likePost.useMutation({
    onSuccess(data) {
      if(data.action=='like'){
        LikePost()
        setUserLikeIt(true)
        if(post)
        likePost(post?.id, userSession.id) 
      }else{
        DislikePost()
        setUserLikeIt(false)
        if(post)
        dislikePost(post?.id, userSession.id)
      }
    },
  })

  const loadMoreCommentHandler = () => {
    // increate the current page 
    setCurrentCommentPageNumber(currentCommentPageNumber + 1)
    // send request to get more comments
    if (!post) return
    mutate({ id: post?.id, page: currentCommentPageNumber, range: PAGINATION.COMMENTS,requesterId:userSession.id,isSharedPost })
  }

  if (!post) return

  const handleLikeButton = ()=>{
    likePostMutate({ postId: post?.id, like: !userLikeIt, userId: userSession.id,isSharedPost })
  }


  const Content = ()=>{
    return( <>
    <div className='flex items-center justify-between px-2 pb-3'>
    <div className='flex gap-x-2'>
    <CustomAvatar className='w-8 h-8' imageUrl={post?.userAuthor?.image?.url} alt={`@${post?.userAuthor?.fullName??''}_profile_img`} />
      <div>
        <div className='flex items-center gap-x-1'>
          <h1>{post?.userAuthor?.fullName}</h1>
          {post?.checkIn && <div className="text-xs opacity-75">{t('at')}{' '}{post?.checkIn?.location}</div>}
          {post?.feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` ${feelingIcon} `}{post?.feeling}</div>}
        </div>
        <div className='flex items-center gap-x-2'>
          <span className='text-xs'>{fromNow(post?.createdAt)}</span><Globe className='w-3 h-3' />
        </div>
      </div>
    </div>
    <Button variant={'ghost'}>
      <MoreHorizontal />
    </Button>
  </div>
  <p className='text-xs px-3 py-3'>{post?.content}</p>
  {post?.mediaList && post?.mediaList.length > 0 && post?.mediaList.map((img, i) => <Media isToxic={img.isToxic} key={i} src={img.url}/>)}
  {/* image grid */}
  <div className='px-2 text-xs pt-4'>
    <div className='flex items-center justify-between pb-2 border-b'>
      <h1>{post?._count.likeList} {t('likes')}</h1>
      <div className='flex items-center gap-x-3'>
        <h1>{post?._count.commentList} {t('comments')}</h1>
        <h1>{post?._count.sharedList} {t('shares')}</h1>
      </div>
    </div>
    <div className='flex items-center justify-between py-1 border-b'>
      <Button onClick={handleLikeButton} variant={'ghost'} className='gap-x-1  scale-90'>
        <ThumbsUp className={`w-4 h-4 ${userLikeIt ? 'fill-red-600 text-red-600' : ''} transition-colors duration-500`} />
        <span className='text-xs capitalize'>{t('like')}</span>
      </Button>
      <Button variant={'ghost'} className='gap-x-1  scale-90'>
        <MessageSquare className='w-4 h-4' />
        <span className='text-xs capitalize'>{t('comment')}</span>
      </Button>
      <Button variant={'ghost'} className='gap-x-1  scale-90'>
        <Share className='w-4 h-4' />
        <span className='text-xs capitalize'>{t('share')}</span>
      </Button>
    </div>
  </div>
  {post.commentList && post.commentList.length > 0 && post.commentList.map((comment, index) => <CommentNode key={index} {...comment} />)}
  {post.commentList.length < post._count.commentList && <Button variant={'link'} size={'sm'} onClick={loadMoreCommentHandler}>{t('seeMoreComments')}</Button>}
  </>
)
  }

  console.log({isMobile})

  if(isMobile){
    return <Drawer open={show} onOpenChange={setShow}>
    <DrawerContent>
      <Content/>
      <WriteComment postId={post.id} isSharedPost={isSharedPost}/>
    </DrawerContent>
  </Drawer>
  }


  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[525px] sm:mt-0 h-fit p-4">
        <ScrollArea className={`w-full max-h-[96vh] h-screen ${post.mediaList && post.mediaList.length > 0 ? 'sm:max-h-[600px]' : 'sm:max-h-[400px]'}`}>
          <Content/>
        </ScrollArea>
        <WriteComment postId={post.id} isSharedPost={isSharedPost}/>
      </DialogContent>
    </Dialog>
  )
}
