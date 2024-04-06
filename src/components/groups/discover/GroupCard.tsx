import { Card } from '../../ui/card'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { type TGetOneGroup } from '@faris/server/module/group/group.handler'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { useGroupListStore } from 'zustandStore/groupListStore'
import Loading from '@faris/components/general/Loading'
import { useToast } from '@faris/components/ui/use-toast'

export const dateDifferent = (date1: Date) => {
  const date2 = new Date();
  const diff = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays
}


export default function GroupCard({ id, profileImage, title, _count, createdAt }: TGetOneGroup) {
  const { t } = useTranslation()
  const {toast} = useToast()
  const userId = useSessionStore(state=>state.user.id)
  const removeGroupFromList = useGroupListStore(state=>state.deleteGroup)
  const {mutate,isLoading} = api.group.userGroupProcedure.useMutation({
    onSuccess(data) {
      removeGroupFromList(data.groupId)
      if(data.wannaJoin){
        toast({
          title:t('groupJoinedSuccessfully')
        })
      }
    },
  })

  return (
    <Card className='pb-3'>
      <div className='w-full max-w-md h-44 overflow-hidden'>
        <Image src={profileImage?.url ?? ''} className='rounded-t-md  object-fill w-full h-full' width={400} height={800} alt='group_profile_image' />
      </div>
      <div className='p-2'>
        <div className='flex items-center gap-x-2 pb-2 sm:pb-1'>
          <div className='text-xs'>
            <h1 className='text-lg font-bold'>{title}</h1>
            <h4 className='opacity-80'>{t('members&posts', { members: _count.groupMember, posts: _count.postList > 0 ? (_count.postList/+dateDifferent(createdAt) ).toFixed(0) : 0 })}</h4>
          </div>
        </div>
        <Button size={'sm'} disabled={isLoading} variant={'secondary'} onClick={()=>mutate({groupId:id,userId,wannaJoin:true})} className='w-full'>{isLoading?<Loading/>:t('joinGroup')}</Button>
      </div>
    </Card>
  )
}
