import { Card, CardHeader } from '../../ui/card'
import PageCard from './PageCard'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { usePageListStore } from 'zustandStore/pageListStore'
import PageCardSkeleton from '@faris/components/skeleton/PageCardSkeleton'
import ViewRender from '@faris/components/general/ViewRender'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function LikedPages() {
  const userId = useSessionStore(state => state.user.id)
  const { range, currentPage, target, setPages, nextPage, pages, loadPages, pageList } = usePageListStore(state => state)
  const { data, isLoading } = api.page.getOneUserLikedPages.useQuery({ userId, range, page: currentPage }, { enabled: !!userId })

  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && pageList.length > 0 && target == 'likedPages',
    target: target ?? '',
    currentTarget: 'likedPages',
    loadFunction: loadPages,
    setFunction: setPages
  })

  return (
    <Card className='p-4 my-6'>
      <CardHeader className='font-bold'>All pages you like (2454)</CardHeader>
      <ViewRender
        illustrations='pages'
        isGrid={true}
        isLoading={isLoading}
        data={pageList}
        skeletonComonent={<PageCardSkeleton />}
        noDataMessage={'noLikedPages'}
        nextPage={nextPage}
        hasNextPage={pages - 1 > currentPage}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
          {pageList.map((page, index) => <PageCard key={index} {...page} />)}
        </div>
      </ViewRender>
    </Card>
  )
}
