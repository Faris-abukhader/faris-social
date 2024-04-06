import React from 'react'
import { Card, CardContent, CardFooter } from '../../ui/card'
import { Button } from '../../ui/button'
import { ThumbsUp } from 'lucide-react'
import CustomAvatar from '../../general/CustomAvatar'
import { type TGetOneGroupInvitation } from '@faris/server/module/group/group.handler'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { useGroupListStore } from 'zustandStore/groupListStore'

export default function InvitationCard({ id, group, sender }: TGetOneGroupInvitation) {
    const { t } = useTranslation()
    const userId = useSessionStore(state => state.user.id)
    const removeGroup = useGroupListStore(state => state.deleteGroup)
    const { mutate, isLoading } = api.group.userGroupProcedure.useMutation({
        onSuccess() {
            removeGroup(id)
        },
    })

    return (
        <Card className=' border-opacity-40'>
            <CardContent className='flex justify-between gap-x-2 pt-4'>
                <div className='flex  items-center gap-x-2'>
                    <CustomAvatar alt={`${group.title}_profile_img`} imageUrl={group.profileImage?.url} />
                    <div className=''>
                        <h1 className='font-bold'>{group.title}</h1>
                        <h3 className='text-xs opacity-80 pb-1'>{group.category}</h3>
                        <h1 className='text-xs opacity-80'><b className=" transition-colors duration-500 hover:text-blue-400 dark:hover:text-blue-700">{sender.fullName}</b> {t('inviteYourToJoinGroup')}</h1>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button disabled={isLoading} onClick={() => mutate({ groupId: group.id, userId, wannaJoin: true, invitationId: id })} size={'sm'} variant={'secondary'} className='w-full gap-x-2'>
                    <ThumbsUp className='w-3 h-3' />
                    <span>{t('accept')}</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
