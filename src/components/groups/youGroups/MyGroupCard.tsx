import { Card } from '@faris/components/ui/card'
import { Button } from '@faris/components/ui/button'
import Link from 'next/link'
import { type TGetOneGroup } from '@faris/server/module/group/group.handler'
import { useTranslation } from 'next-i18next';import CustomAvatar from '@faris/components/general/CustomAvatar'
import { dateDifferent } from '../discover/GroupCard'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@faris/components/ui/dropdown-menu'
import { Delete, Edit2Icon, EditIcon, UserX2 } from 'lucide-react'
import { useUpdateGroupModel } from './UpdateGroupModel'
import { useGroupListStore } from 'zustandStore/groupListStore'
import { api } from '@faris/utils/api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@faris/components/ui/alert-dialog'
import Loading from '@faris/components/general/Loading'
import useSessionStore from 'zustandStore/userSessionStore'
import { useToast } from '@faris/components/ui/use-toast'

interface MyGroupCard {
    group: TGetOneGroup
    isOwner?: boolean
}
export default function MyGroupCard({ group, isOwner = true }: MyGroupCard) {
    const { t } = useTranslation()
    const {toast} = useToast()
    const ownerId = useSessionStore(state => state.user.id)
    const setShowUpdateModel = useUpdateGroupModel(state => state.setShow)
    const deleteGroup = useGroupListStore(state => state.deleteGroup)
    const { mutate, isLoading } = api.group.deleteOne.useMutation({
        onSuccess() {
            deleteGroup(group.id)
            toast({
                title:t('groupWasDeletedSuccessfully')
            })
        },
    })
    const { mutate: disJoinGroup } = api.group.userGroupProcedure.useMutation({
        onSuccess(data) {
            deleteGroup(data.groupId)
            toast({
                title:t('groupWasLeavedSuccessfully')
            })
        },
    })

    const renderDropdown = () => {
        if (isOwner) {
            return <>
                <DropdownMenuItem className='gap-x-2' onClick={() => setShowUpdateModel(true,group)}>
                    <Edit2Icon className='w-4 h-4' />
                    <span>{t('update')}</span>
                </DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className='w-full flex items-center justify-start gap-x-2 px-2 hover:bg-accent rounded-sm py-1'>
                            <Delete className='w-4 h-4' />
                            <span>{t('delete')}</span>
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteNotice')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('deleteGroupDescription')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction disabled={isLoading} onClick={() => mutate({ groupId: group.id, ownerId })}>{isLoading ? <Loading /> : t('confirm')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        } else {
            return <DropdownMenuItem className='gap-x-1' onClick={() => disJoinGroup({ groupId: group.id, userId: ownerId, wannaJoin: false })}>
                <UserX2 className='w-4 h-4' />
                <span>{t('leaveGroup')}</span>
            </DropdownMenuItem>
        }
    }
    return (
        <Card className='p-4'>
            <div className='w-full flex justify-end'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className='rounded-full p-0 w-9 h-9' variant="outline"><EditIcon className='w-4 h-4' /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {renderDropdown()}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <section className='flex items-center gap-x-2 pb-3'>
                <CustomAvatar className='rounded-md w-16 h-16' imageUrl={group?.profileImage?.url} alt={`${group?.title}_group_image`} />
                <div className=''>
                    <h1 className='font-bold'>{group?.title}</h1>
                    <h4 className='text-xs opacity-70'>{new Date(group?.createdAt).toLocaleDateString()}</h4>
                    <h4 className='text-xs opacity-80'>{t('members&posts', { members: group?._count.groupMember, posts: group?._count.postList > 0 ? +(group?._count.postList/dateDifferent(group?.createdAt)).toFixed(1) : 0 })}</h4>
                </div>
            </section>
            <Link href={`/group/${group?.id}`}>
                <Button size={'sm'} className='w-full'>{t('viewGroup')}</Button>
            </Link>
        </Card>
    )
}
