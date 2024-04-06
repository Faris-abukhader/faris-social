import { memo } from 'react'
import PageCard from '../PageCard'
import { Button } from '../../ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { usePageModel } from '../CreateNewPageModel'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { usePageListStore } from 'zustandStore/pageListStore'
import PageCardSkeleton from '../../skeleton/PageCardSkeleton'
import ViewRender from '@faris/components/general/ViewRender'
import { useDataEffect } from '@faris/hooks/customDataLoader'

const YourPages = () => {
  const { t } = useTranslation()
  const showCreatePageModel = usePageModel(state => state.setShow)
  const userId = useSessionStore(state => state.user.id)
  const { range, currentPage, target, setPages,nextPage,pages, loadPages, pageList } = usePageListStore(state => state)
  const { data, isLoading } = api.page.getOneUserPages.useQuery({ userId, page: currentPage, range }, { enabled: !!userId })


  useDataEffect<string>({data,
    currentPage,
    condition:currentPage==0 && pageList.length > 0 && target=='yourPages',
    target:target??'',
    currentTarget:'yourPages',
    loadFunction:loadPages,
    setFunction:setPages})

  return (
    <div className='pt-10'>
      <div className='flex-row space-y-3 sm:space-y-0 sm:flex items-center justify-between px-2'>
        <div>
          <h1 className=' font-bold'>{t('pagesYouManage')}</h1>
          <p className='text-xs opacity-80'>{t('managingPagesDescription')}</p>
        </div>
        <Button onClick={() => showCreatePageModel(true)} variant={'secondary'} className='flex items-center gap-x-1'>
          <Plus className='w-4 h-4' />
          <span>{t('createNewPage')}</span>
        </Button>
      </div>
        <ViewRender
          illustrations='pages'
          isGrid={false}
          isLoading={isLoading}
          data={data?.data || []}
          skeletonComonent={<PageCardSkeleton/>}
          noDataMessage={'youDontHavePages'}
          nextPage={nextPage}
          hasNextPage={pages-1 > currentPage}
        >
          <div className='space-y-2 py-5'>
          {pageList.map((page,index) => <PageCard key={index} {...page} />)}
          </div>
        </ViewRender>
    </div>
  )
}

export default memo(YourPages);