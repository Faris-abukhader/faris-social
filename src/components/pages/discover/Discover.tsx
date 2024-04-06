import PageWidget from './PageWidget'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import { usePageListStore } from 'zustandStore/pageListStore'
import useSessionStore from 'zustandStore/userSessionStore'
import PageWidgetSkeleton from '../../skeleton/PageWidgetSkeleton'
import ViewRender from '@faris/components/general/ViewRender'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function Discover() {
  const {t} = useTranslation()
  const {currentPage,range,pageList,setPages,nextPage,pages,loadPages,target} = usePageListStore(state=>state)
  const userId = useSessionStore(state=>state.user.id)
  const {data,isLoading} = api.page.getOneUserRecommendedPages.useQuery({userId,page:currentPage,range},{enabled:!!userId})


  useDataEffect<string>({data,
    currentPage,
    condition:currentPage==0 && pageList.length > 0 && target == 'discover',
    target:target??'',
    currentTarget:'discover',
    loadFunction:loadPages,
    setFunction:setPages})

  // useEffect(() => {
  //   // to avoid any reload for first page
  //   if(currentPage==0 && pageList.length > 0 && target == 'discover'){
  //     return
  //   }
    
  //   if (data) {
  //     if (target == 'discover') {
  //       loadPages(data.data, data.pageNumber)
  //     } else {
  //       setPages(data.data, data.pageNumber, 'discover')
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data])

  return (
    <div className='py-5'>
      <h1 className=' font-bold text-2xl pb-2'>{t('discoverPages')}</h1>
      <h2 className=' font-bold text-xl'>{t('suggestedForYou')}</h2>
        <ViewRender
          illustrations='pages'
          isGrid={true}
          isLoading={isLoading}
          data={data?.data || []}
          skeletonComonent={<PageWidgetSkeleton/>}
          noDataMessage={'noDiscoverPages'}
          nextPage={nextPage}
          hasNextPage={pages-1 > currentPage}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
          {pageList.map((page,index) => <PageWidget key={index} {...page} />)}
          </div>
        </ViewRender>
      </div>
  )
}
