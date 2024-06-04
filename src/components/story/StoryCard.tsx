import CustomAvatar from '../general/CustomAvatar'
import fromNow from '@faris/utils/fromNow'
import Link from 'next/link'
import Indecators from './Indecators'
import { Button } from '../ui/button'
import { EyeIcon, Heart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { useStoryGallary } from 'zustandStore/storyGallaryStore'
import StoryLikedList from './StoryLikedList'
import DeleteStoryDialog from './DeleteStoryDialog'
import Media from '../general/Media'

// todo 
// the size of image with small screen 
// the image goes outside the window
export default function StoryCard() {
  const { setShow, currentStoryIndex, currentProfileIndex, getCurrentProfile, getCurrentStory, nextStory, previousStory, storyLikeProcedure } = useStoryGallary(state => state)
  const [progressValue, setProgressValue] = useState(0)
  const [showLikeList,setShowLikeList] = useState(false)
  const user = useSessionStore(state=>state.user)
  const {mutate,isLoading} = api.story.likeProcedure.useMutation({
    onSuccess(data) {
      storyLikeProcedure(data.targetStory.owner.id,
        data.targetStory.id,
        {
          ...user,
          createdAt:new Date(),
          image:{
            url:user.image??'',
            thumbnailUrl:user.thumbnailUrl??''
          }
        },
        data.isLike)
    },
  })

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds
    const incrementInterval = 50; // Increment every 50ms
    const totalIncrements = totalDuration / incrementInterval;
    let currentIncrement = 0;

    const interval = setInterval(() => {
      if (currentIncrement <= totalIncrements) {
        setProgressValue((currentIncrement / totalIncrements) * 100);
        currentIncrement++;
      } else {
        clearInterval(interval);
        nextStory()
      }
    }, incrementInterval);

    return () => {
      clearInterval(interval);
    };
  }, [currentStoryIndex, nextStory, currentProfileIndex]);

  if (getCurrentProfile() == undefined || getCurrentStory() == undefined) return

  return (
    <div className='relative w-full sm:w-[384px] h-screen sm:h-[500px] overflow-hidden- sm:rounded-md sm:shadow-sm bg-slate-200 dark:bg-slate-800 space-y-2'>
      <Indecators value={progressValue} total={getCurrentProfile()?.stories.length ?? 0} current={currentStoryIndex} />
      <div className='w-full pt-4 flex items-center gap-x-2 px-2'>
        <CustomAvatar imageUrl={getCurrentProfile()?.owner?.image?.url} alt={`${getCurrentProfile()?.owner?.fullName ?? ''}_profile`} />
        <Link href={`/profile/${getCurrentProfile()?.owner?.id ?? ''}`} className='font-bold hover:underline'>{getCurrentProfile()?.owner?.fullName}</Link>
        <p className='text-xs'>{fromNow(getCurrentProfile()?.stories[currentStoryIndex]?.createdAt ?? new Date())}</p>
        <Button variant={'ghost'} className='absolute rounded-full sm:hidden w-fit h-fit p-2 right-2' onClick={() => setShow(false)}><X /></Button>
        {getCurrentStory()?.owner.id == user.id &&<DeleteStoryDialog/>}
      </div>
      <div className='relative w-full flex-1 overflow-hidden h-full bg-transparent '>
        <Media containerClassName='z-30' isToxic={getCurrentStory()?.media?.isToxic??false} src={getCurrentStory()?.media?.url ?? ''} className='w-full h-full object-cover'/>
        <div onClick={() => previousStory()} className='absolute top-0 left-0 w-1/2 bg-opacity-25 h-full z-20'></div>
        <div onClick={() => nextStory()} className='absolute top-0 right-0 w-1/2  bg-opacity-25 h-full z-20'></div>
        <Button disabled={isLoading} onClick={()=>mutate({userId:user.id,storyId:getCurrentStory()?.id??'',isLike:!getCurrentStory()?.isLiked})} variant={'ghost'} className='absolute right-3 bottom-3 z-40'>
        <Heart className={`w-4 h-4 ${getCurrentStory()?.isLiked? 'fill-red-600 text-red-600' : ''} transition-colors duration-500`} />
      </Button>
      </div>
      <div className='absolute flex left-3 bottom-3 gap-x-1'>
        <div className='flex -gap-x-3'>
        {getCurrentStory()?.likeList && getCurrentStory()?.likeList.map((friend) =><CustomAvatar key={friend.id} className='shadow-sm w-6 h-6' imageUrl={friend.image?.url??''} alt={`@${friend?.fullName}_profile_img`} />)}
        </div>
        {getCurrentStory() && getCurrentStory()?.hasMore || true && getCurrentStory()?.owner.id==user.id && <Button onClick={()=>setShowLikeList(!showLikeList)} variant={'outline'} className='w-fit h-fit p-1 rounded-full'><EyeIcon className='w-4 h-4'/></Button>}
      </div>
      <StoryLikedList {...{show:showLikeList,setShow:setShowLikeList,storyId:getCurrentStory()?.id??null}}/>
    </div>
  )
}
