import CustomAvatar from '../general/CustomAvatar'
import { Card } from '../ui/card'
import { api } from '@faris/utils/api'
import { useSearchingDataLoader } from '@faris/hooks/searchingDataLoader'
import { Skeleton } from '../ui/skeleton'
import useSessionStore from 'zustandStore/userSessionStore'
import { useStoryGallary } from 'zustandStore/storyGallaryStore'
import ShareStory from './ShareStory'

export default function StoryBar({ profileId }: { profileId: string }) {
  const { setShow, range, currentPage, storyList, setData, loadData, setCurrentProfile } = useStoryGallary(state => state)
  const requesterId = useSessionStore(state => state.user.id)
  const { data, isLoading } = api.story.oneProfileFriendStoryList.useQuery({ profileId, range, page: currentPage, requesterId }, { enabled: !!profileId })

  useSearchingDataLoader({
    data,
    currentPage: currentPage,
    condition: storyList.length > 0,
    target: 'page',
    procedure: storyList.length > 0 ? 'load' : 'set',
    setFunction: setData,
    loadFunction: loadData
  })

  if (!isLoading && storyList.length == 0) return <></>

  return (
    <Card className='w-full overflow-hidden px-2 py-4 border-0 border-b rounded-none'>
      <div className='flex items-center gap-x-2 overflow-x-auto'>
        <ShareStory type='circle' />
        {isLoading ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className='w-8 h-8 rounded-full' />) :
          storyList && storyList.map((story, i) => <CustomAvatar onClick={() => { setShow(true); setCurrentProfile(i) }} className='hover:cursor-pointer' key={i} imageUrl={story?.owner?.image?.url} alt='logo' />)
        }
      </div>
    </Card>
  )
}
