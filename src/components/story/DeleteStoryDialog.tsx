import { AlertDialog, AlertDialogHeader, AlertDialogFooter, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@faris/components/ui/alert-dialog'
import { Button } from '@faris/components/ui/button'
import { api } from '@faris/utils/api'
import { TrashIcon } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { useStoryGallary } from 'zustandStore/storyGallaryStore'
import { useToast } from '../ui/use-toast'

export default function DeleteStoryDialog() {
    const { t } = useTranslation()
    const {toast} = useToast()
    const storyId = useStoryGallary(state => state.getCurrentStory()?.id)
    const deleteStory = useStoryGallary(state => state.deleteStory)
    const { mutate } = api.story.deleteOne.useMutation({
        onSuccess(data) {
            deleteStory(data.id)
            toast({
                title:t('storyDeletedSuccessfully')
              })
        },
    })

    if (!storyId) return

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='w-fit h-fit p-2 rounded-full' variant={'ghost'}><TrashIcon className='w-4 h-4 text-red-400' /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='z-[200]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteNotice')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('deleteStoryDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate({ id: storyId })}>{t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
