import ViewRender from '@faris/components/general/ViewRender'
import HashtagSkeleton from '@faris/components/skeleton/HashtagSkeleton'
import { type TGetOneHashtag } from '@faris/server/module/hashtag/hashtag.handler'
import { api } from '@faris/utils/api'
import Link from 'next/link'
import { memo } from 'react'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { Card } from '@faris/components/ui/card'

const Item = ({title,_count}:TGetOneHashtag) => {
  const {t} = useTranslation()
  return (
    <Link href={`/search?query=${title.slice(1)}&tap=hashtag`}>
      <div className='text-popover-foreground hover:bg-gray-100 hover:dark:bg-gray-900 rounded-md p-2 hover:cursor-pointer'>
      <h1 className=' text-base font-bold'>{title}</h1>
      <p className='text-xs'>{t('postWithNumber',{number:`${_count.postList+_count.sharedPostList}`})}</p>
      </div>
    </Link>
  )
}

const TrendForYou = () => {
  const {t} = useTranslation()
  const {isReady,user} = useSessionStore(state => state)
  const {data,isLoading} = api.hashtag.getTrendingList.useQuery({location:user.livingLocation??undefined},{enabled:isReady})

  return (
    <Card className='mt-4 p-4'>
      <h1 className=' font-bold py-3'>{t('trendForYou')}</h1>
      <ViewRender
          illustrations='hashtag'
          isGrid={false}
          isLoading={isLoading}
          data={data || []}
          skeletonComonent={<HashtagSkeleton/>}
          noDataMessage={'noTrendingHashtag'}
          hasNextPage={false}
          illustrationSize={{width:140,height:140}}
        >
          <div className='py-3 space-y-2 pb-12'>
          {data && data.map(hashtag=><Item key={hashtag.id} {...hashtag}/>)}
          </div>
        </ViewRender>
    </Card>
  )
}

export default memo(TrendForYou)
