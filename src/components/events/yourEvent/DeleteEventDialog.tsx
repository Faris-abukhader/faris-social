import Loading from '@faris/components/general/Loading'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@faris/components/ui/alert-dialog'
import { useToast } from '@faris/components/ui/use-toast'
import { api } from '@faris/utils/api'
import { useTranslation } from 'next-i18next';import { useEventListStore } from 'zustandStore/eventList'
import { modelStoreGenerator } from 'zustandStore/modelStore'

export const useDeleteEventDialog = modelStoreGenerator<string>()

export default function DeleteEventDialog() {
    const { t } = useTranslation()
    const {toast} = useToast()
    const {show,setShow,data} = useDeleteEventDialog(state=>state)
    const deleteEvent = useEventListStore(state=>state.deleteEvent)
    const {mutate,isLoading} = api.event.deleteOneEvent.useMutation({
        onSuccess(data) {
            deleteEvent(data.id)
            setShow(false)
            toast({
                title:t('eventDeletedSuccessfully')
            })
        },
    })

    if(!data)return
    return (
        <AlertDialog open={show} onOpenChange={setShow}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteNotice')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('deleteEventDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={()=>mutate({id:data})}>{isLoading ? <Loading/>: t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>)
}