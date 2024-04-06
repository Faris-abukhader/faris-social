import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import PostList from './PostList'
import IntroTab from './intro/IntroTab'
import LastPhotos from './photo/LastPhotos'
import PhotoTab from './photo/PhotoTab'
import FollowerTab from './follower/FollowerTab'
import ReviewList from './review/ReviewTab'
import { useTranslation } from 'next-i18next';import { type TGetOneFullPage } from '@faris/server/module/page/page.handler'
import { memo, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface PageContentProps {
  page: TGetOneFullPage
}

const taps = ['posts', 'about', 'reviews', 'photos', 'followers'] as const

const PageContent = ({ page }: PageContentProps) => {
  const { t } = useTranslation()
  const [currentTap, setCurrentTap] = useState<null|string>()
  const { push, query, isReady } = useRouter()

  useEffect(() => {
    isReady && setCurrentTap(query?.tap as string ?? 'posts')
  }, [isReady, query?.tap])

  // when user click in any time we update the state holder of tabs and update the url quey
  const updateTap = useCallback((newTap: string) => {
    setCurrentTap(newTap)
    void push({ query: { ...query, tap: newTap } }, undefined, { shallow: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  if(!currentTap)return

  return (
    <Tabs defaultValue={query?.tap as string ?? 'posts'} value={currentTap} className="w-full py-5 pb-20">
      <TabsList className={`grid w-full grid-cols-5 mb-4`}>
        {taps.map(tap=><TabsTrigger key={tap} value={tap} onClick={() => updateTap(tap)}>{t(tap)}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="posts" className='flex md:gap-x-2 items-start justify-center md:justify-start'>
        <PostList page={{id:page.id,title:page.title,createdAt:new Date(),category:page.category,profileImage:page.profileImage}} pageId={page?.id} ownerId={page?.owner?.id} />
        <div className='w-full space-y-4 hidden md:block'>
          <IntroTab {...page} />
          <LastPhotos mediaList={page?.mediaList} _count={page?._count} />
        </div>
      </TabsContent>
      <TabsContent value="about">
        <IntroTab {...page} />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewList pageID={page?.id} ownerId={page?.owner?.id} totalReviews={page?._count?.reviewList} rate={page?.averageRate??0} />
      </TabsContent>
      <TabsContent value="photos">
        <PhotoTab pageId={page.id} />
      </TabsContent>
      <TabsContent value="followers">
        <FollowerTab pageId={page?.id} />
      </TabsContent>
    </Tabs>
  )
}

export default memo(PageContent)