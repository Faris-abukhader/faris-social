import { useSearchParams } from 'next/navigation'
import { useSearchingStore } from 'zustandStore/searchingStore'
import { api } from '@faris/utils/api'
import ViewRender from '@faris/components/general/ViewRender'
import UserCardSkeleton from '@faris/components/skeleton/UserCardSkeleton'
import { type TSearchingHashtag } from '@faris/server/module/search/search.handler'
import { useSearchingDataLoader } from '@faris/hooks/searchingDataLoader'
import useSessionStore from 'zustandStore/userSessionStore'
import PostCard from '../general/PostCard'
import SharedPostCard from '../general/SharedPostCard'
import { type GetOneSharedPost } from '@faris/server/module/post/post.handler'
export default function HashtagTap() {
  const searchParams = useSearchParams()
  const requesterId = useSessionStore(state=>state.user.id)
  const query = searchParams.get('query')
  const { dataList, setData, loadData, nextPage, currentPage, pages, range, type } = useSearchingStore(state => state);
  const { data, isLoading } = api.searching.hashtag.useQuery({ requesterId,title:`#${String(query)}`, page: currentPage, range }, { enabled: !!query && !!requesterId }) 

  console.log({data})
  useSearchingDataLoader({
    data,
    currentPage,
    condition: dataList.length > 0 && type=='hashtag',
    target: 'hashtag',
    procedure:type ? (type=='hashtag'?'load':'set'):'none',
    setFunction: setData,
    loadFunction:loadData
  })

  return <ViewRender
    illustrations='groups'
    isGrid={false}
    isLoading={isLoading}
    data={dataList}
    skeletonComonent={<UserCardSkeleton />}
    noDataMessage={'noResult'}
    nextPage={nextPage}
    hasNextPage={pages - 1 > currentPage}
  >
    <div className='p-3 py-3'>
    {dataList.map((record: TSearchingHashtag, i) => record.type=='shared'?<SharedPostCard key={i} {...record as GetOneSharedPost}/>:<PostCard key={i} {...record}/>)}
    </div>
  </ViewRender>
}