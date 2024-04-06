import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import PostList from './PostList'
import IntroTab from './IntroTab'
import IntroSkeleton from '../skeleton/IntroSkeleton'
import FriendWidget from './friend/FriendWidget'
import LastPhotos from './photo/LastPhotos'
import FriendsTab from './friend/FriendsTab'
import PhotoTab from './photo/PhotoTab'
import CheckInTab from './checkIn/CheckInsTab'
import { useTranslation } from 'next-i18next';
import { memo, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { type GetOneProfile } from '@faris/server/module/profile/profile.handler'
import useSessionStore from 'zustandStore/userSessionStore'
import IllustrationContainer from '../general/IllustrationContainer'
import useLocalizationStore from 'zustandStore/localizationStore'

const taps = ['posts', 'about', 'friends', 'photos', 'checkIns'] as const

const ProfileContents = (profile: GetOneProfile)=> {
  const [currentTap, setCurrentTap] = useState('posts')
  const { push, query, isReady } = useRouter()
  const userId = useSessionStore(state=>state.user.id)
  const { t } = useTranslation()
  const language = useLocalizationStore(state=>state.language)

  const isBlocked = useCallback(()=>{
    if(profile?.blockedList?.indexOf(userId)!== -1){
      return true 
    }
    return false
  },[profile,userId])

  useEffect(() => {
    isReady && setCurrentTap(query?.tap as string ?? 'posts')
  }, [isReady, query?.tap])

  // when user click in any time we update the state holder of tabs and update the url quey
  const updateTap = useCallback((newTap: string) => {
    setCurrentTap(newTap)
    void push({ query: { ...query, tap: newTap } }, undefined, { shallow: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  if(isBlocked())return <div className='py-20'>
  <IllustrationContainer description={t('youBlockedByThisUser')} path='/illustrations/blocked.svg'/>
  </div> 
  return (
    <Tabs dir={language=='ar'?'rtl':'ltr'} value={currentTap} className="w-full">
      <TabsList className={`grid w-full grid-cols-5 mb-4`}>
        {taps.map(tap => <TabsTrigger key={tap} value={tap} onClick={() => updateTap(tap)}>{t(tap)}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="posts" className='flex md:gap-x-2 items-start justify-center md:justify-start'>
        <PostList id={profile.id} />
        <div className='w-full space-y-4 hidden md:block'>
          {profile ? <IntroTab {...profile} /> : <IntroSkeleton />}
          <FriendWidget profileId={profile.id} />
          <LastPhotos profileId={profile.id} />
        </div>
      </TabsContent>
      <TabsContent value="about">
        <IntroTab {...profile} />
      </TabsContent>
      <TabsContent value="friends">
        <FriendsTab id={profile.id} friends={Number(profile?._count?.friendList??0) + Number(profile?._count?.friendOf??0)} />
      </TabsContent>
      <TabsContent value="photos">
        <PhotoTab id={profile.id} />
      </TabsContent>
      <TabsContent value="checkIns">
        <CheckInTab id={profile.id} />
      </TabsContent>
    </Tabs>
  )
}

export default memo(ProfileContents)