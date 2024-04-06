import { Card, CardContent, CardFooter } from "@faris/components/ui/card";
import { ThumbsUp } from "lucide-react";
import { Button } from "@faris/components/ui/button";
import { type TGetOnePageInvitation } from "@faris/server/module/page/page.handler";
import { api } from "@faris/utils/api";
import { usePageListStore } from "zustandStore/pageListStore";
import useSessionStore from "zustandStore/userSessionStore";
import { useTranslation } from "next-i18next";
import Loading from "@faris/components/general/Loading";
import Link from "next/link";
import CustomAvatar from "@faris/components/general/CustomAvatar";
import { useToast } from "@faris/components/ui/use-toast";

export default function PageCard({ id, sender, page }: TGetOnePageInvitation) {
    const { t } = useTranslation()
    const {toast} = useToast()
    const userId = useSessionStore(state => state.user.id)
    const { deletePage } = usePageListStore(state => state)
    const { mutate, isLoading } = api.pageInvitation.acceptOne.useMutation({
        onSuccess() {
            deletePage(id)
            toast({
                title:t('pageInvitationAcceptedSuccessfully')
            })
        },
    })

    return (
        <Card className=' border-opacity-40'>
            <CardContent className='flex justify-between gap-x-2 pt-4'>
                <div className='flex  items-center gap-x-2'>
                    <CustomAvatar className='w-20 h-20' imageUrl={page.profileImage?.url} alt={`@${page.title}_profile_img`} />
                    <div className=''>
                        <h1 className='font-bold'>{page.title}</h1>
                        <h3 className='text-xs opacity-80 pb-1'>{t(page.category as string)}</h3>
                        <Link href={`/profile/${sender.id}`} className="flex items-center gap-x-1">
                            <CustomAvatar className='w-4 h-4' imageUrl={sender.image?.url} alt={`${sender.image?.url ?? ''}_profile_img`} />
                            <h1 className='text-xs opacity-80'><b className=" transition-colors duration-500 hover:text-blue-400 dark:hover:text-blue-700">{sender.fullName}</b> {t('inviteYourToLikePage')}</h1>
                        </Link>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {isLoading ? <Loading />
                    :
                    <Button disabled={isLoading} onClick={() => mutate({ pageId: page.id, recipientId: userId, id })} size={'sm'} variant={'secondary'} className='w-full gap-x-2'>
                        <ThumbsUp className='w-3 h-3' />
                        <span>{t('accept')}</span>
                    </Button>}
            </CardFooter>
        </Card>
    )
}