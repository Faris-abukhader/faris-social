import  { useEffect } from 'react'
import {  CardHeader } from '../../ui/card'
import PageCard from './PageCard'
import { useTranslation } from 'next-i18next';import PageWidgetSkeleton from '@faris/components/skeleton/PageWidgetSkeleton'
import { api } from '@faris/utils/api'
import { usePageListStore } from 'zustandStore/pageListStore'
import useSessionStore from 'zustandStore/userSessionStore'
import ViewRender from '@faris/components/general/ViewRender'

export default function Invitations() {
  const {t} = useTranslation()
  const {currentPage,range,invitationList,setPageInvitations,nextPage,pages,loadInvitations,target} = usePageListStore(state=>state)
  const userId = useSessionStore(state=>state.user.id)
  const {data,isLoading} = api.page.getOneUserInvitationPages.useQuery({userId,page:currentPage,range},{enabled:!!userId})


  useEffect(() => {
    // to avoid any reload for first page
    if(currentPage==0 && invitationList.length > 0 && target == 'invitations'){
      return
    }
    
    if (data) {
      if (target == 'invitations') {
        loadInvitations(data.data, data.pageNumber)
      } else {
        setPageInvitations(data.data, data.pageNumber, 'invitations')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className='p-4 my-6'>
      <CardHeader className='font-bold text-2xl'>{t('invitations')}</CardHeader>
        <ViewRender
          illustrations='pages'
          isGrid={true}
          isLoading={isLoading}
          data={invitationList}
          skeletonComonent={<PageWidgetSkeleton/>}
          noDataMessage={'noPageInvitationFound'}
          nextPage={nextPage}
          hasNextPage={pages-1 > currentPage}
        >
          <div className='grid grid-cols-1 gap-2'>
          {invitationList.map((page,index) => <PageCard key={index} {...page} />)}
          </div>
        </ViewRender>
    </div>
  )
}
