import { Card, CardContent, CardFooter } from '../../ui/card'
import { Button } from '../../ui/button'
import { MessageSquarePlus, MoreHorizontal, ThumbsDown } from 'lucide-react'
import { type TGetOnePage } from '@faris/server/module/page/page.handler'
import { useTranslation } from 'next-i18next';import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@faris/components/ui/dropdown-menu'
import { api } from '@faris/utils/api'
import Loading from '@faris/components/general/Loading'
import { usePageListStore } from 'zustandStore/pageListStore'
import useSessionStore from 'zustandStore/userSessionStore'
import CustomAvatar from '@faris/components/general/CustomAvatar'

export default function PageCard({ id, title, category, profileImage,conversationId }: TGetOnePage) {
    const { t } = useTranslation()
    const userId = useSessionStore(state => state.user.id)
    const { deletePage } = usePageListStore(state => state)
    const { mutate, isLoading } = api.page.userPageProcedure.useMutation({
        onSuccess(data) {
            deletePage(data.pageId)
        },
    })
    return (
        <Card className=' border-opacity-40'>
            <CardContent className='flex justify-between gap-x-2 pt-4'>
                <div className='flex  items-center gap-x-2'>
                    <CustomAvatar imageUrl={profileImage?.url} alt={`@${title}_profile_img`} />
                    <div>
                        <Link href={`/page/${id}`} className='font-bold'>{title}</Link>
                        <h3 className='text-xs opacity-80'>{t(category as string)}</h3>
                    </div>
                </div>
                <DropdownMenu>
                    {isLoading ? <Loading /> : <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>}
                    <DropdownMenuContent className={`w-48`}>
                        <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => mutate({ pageId: id, userId, isLike: false })} >
                            <ThumbsDown className='w-4 h-4' />
                            <span>{t('dislike')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
            <CardFooter>
                <Link href={conversationId != undefined ? `/messages?conversation=${conversationId}` : `/messages?contactId=${id}_page`}>
                    <Button variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
                        <MessageSquarePlus className='w-3 h-3' />
                        <span>{t('sendMessage')}</span>
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
