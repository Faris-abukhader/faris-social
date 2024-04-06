import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { updateOneEventSchema,type UpdateOneEvent } from "@faris/server/module/event/event.schema"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "next-i18next"
// import { create } from "zustand"
import useSessionStore from "zustandStore/userSessionStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { CheckIcon, Navigation, Webcam } from "lucide-react"
import { DatePicker } from "../../general/DatePicker"
import { api } from "@faris/utils/api"
import Loading from "../../general/Loading"
import interestList from "public/interestedList"
import { ScrollArea } from "../../ui/scroll-area"
import { useState } from "react"
import ImageUploader from "../../post/ImageUploader"
import { useEventListStore } from "zustandStore/eventList"
import CustomAvatar from "@faris/components/general/CustomAvatar"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { useToast } from "@faris/components/ui/use-toast"

export const useUpdateEventModel = modelStoreGenerator<UpdateOneEvent>()
export function UpdateEventModel() {
    const { show, setShow, data } = useUpdateEventModel(state => state)
    const userSession = useSessionStore(state => state.user)
    const [dummy,setDummy] = useState(0)
    const { t } = useTranslation()
    const {toast} = useToast()
    const updateEvent = useEventListStore(state=>state.updateEvent)

    const methods = useForm({
        resolver: valibotResolver(updateOneEventSchema),
        defaultValues: data as UpdateOneEvent
    })

    const { getValues, setValue, register, formState: { isValid } } = methods

    const {mutate,isLoading} = api.event.updateOne.useMutation({
        onSuccess(data) {
          updateEvent(data.id,data)
          toast({
            title:t('eventUpdatedSuccessfully')
        })
        },
        onSettled() {
            setShow(false)
        }
    })

    if(!data) return

    const handleSubmit = ()=> mutate(getValues())
    
    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="p-5 sm:max-w-[500px] sm:max-h-[400px] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className=" capitalize">{t('updateEvent')}</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
              <ImageUploader/>
                <section className="w-full flex items-center justify-between py-4">
                    <div className="flex items-center gap-x-2">
                    <CustomAvatar alt={userSession.fullName} imageUrl={userSession.image??undefined}/>
                        <div>
                            <h1 className="font-bold">{userSession.fullName}</h1>
                            <p className="text-xs text-opacity-70">{t('hostIsYourProfile')}</p>
                        </div>
                    </div>
                </section>
                <section className=" space-y-3">
                    <Input placeholder={t('eventName')} {...register('title')} />
                    <Input placeholder={t('eventDescription')} {...register('description')}/>
                    <DatePicker textPlaceholder={t('eventDate')} date={getValues('eventTime')} onChange={(date)=>setValue('eventTime',date)}/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">{getValues('category') ? getValues('category'): t('selectCategory')}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <ScrollArea className="w-full h-[40vh]">
                            {interestList.map((item,index)=><DropdownMenuItem className="gap-x-2 hover:cursor-pointer" key={index} onClick={()=>{setValue('category',item),setDummy(dummy+1)}}>
                               {getValues('category')==item && <CheckIcon className="w-4 h-4"/>} <span>{t(item)}</span>
                            </DropdownMenuItem>)}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">{getValues('type')!='none' ? t(getValues('type') as string): t('isInPersonOrVirtual')}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem className=" gap-x-2" onClick={()=>{setValue('type','inPerson');setDummy(dummy+1)}}>
                                <Navigation className="w-4 h-4"/>
                                <span>{t('inPerson')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" gap-x-2" onClick={()=>{setValue('type','virtual');setDummy(dummy+1)}}>
                                <Webcam className="w-4 h-4"/>
                                <span>{t('virtual')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
                </FormProvider>
                <DialogFooter>
                    <Button disabled={!isValid} onClick={handleSubmit}>{isLoading ? <Loading/>: t('updateEvent')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}