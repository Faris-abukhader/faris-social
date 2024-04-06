import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "next-i18next"
import useSessionStore from "zustandStore/userSessionStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@faris/components/ui/dropdown-menu"
import { CheckIcon } from "lucide-react"
import { api } from "@faris/utils/api"
import Loading from "@faris/components/general/Loading"
import { ScrollArea } from "@faris/components/ui/scroll-area"
import { useState } from "react"
import eventCategories from "@faris/utils/eventCategories"
import ProfileUploader from "../gettingStart/ProfileUploader"
import { type CreateNewPage, createNewPageSchema } from "@faris/server/module/page/page.schema"
import CoverUploader from "../gettingStart/CoverUploader"
import { usePageListStore } from "zustandStore/pageListStore"
import { createNewPageInitalValues } from "@faris/server/module/page/page.initial"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { useToast } from "../ui/use-toast"

export const usePageModel = modelStoreGenerator()

export default function CreateNewPageModel() {
    const { show, setShow } = usePageModel(state => state)
    const userSession = useSessionStore(state => state.user)
    const [dummy,setDummy] = useState(0)
    const { t } = useTranslation()
    const {toast} = useToast()
    const {createPage} = usePageListStore(state=>state)

    const methods = useForm({
        resolver: valibotResolver(createNewPageSchema),
        defaultValues: createNewPageInitalValues as CreateNewPage
    })

    const { getValues, setValue, register, formState: { } } = methods

    const {mutate,isLoading} = api.page.createOne.useMutation({
        onSuccess(data) {
            createPage(data,'yourPages')
            toast({
                title:t('pageCreatedSuccessfully')
            })
        },
        onSettled() {
            setShow(false)
        }
    })

    const handleSubmit = ()=> mutate({...getValues(),ownerId:userSession.id})
    
    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="p-5 sm:max-w-[500px] sm:max-h-[480px] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className=" capitalize">{t('createNewPage')}</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                  <ProfileUploader setImage={(img)=>{setValue('profileImage.url',img.url);setValue('profileImage.path',img.path)}}/>
                <CoverUploader coverImage={getValues('coverImage.url')} setCoverImage={(img)=>{setValue('coverImage.url',img.url);setValue('coverImage.path',img.path)}}/>
                <section className=" space-y-3">
                    <Input placeholder={t('pageName')} {...register('title')} />
                    <Input placeholder={t('identifier')} {...register('identifier')}/>
                    <Input placeholder={t('pageBio')} {...register('about')}/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">{getValues('category') ? getValues('category'): t('selectCategory')}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <ScrollArea className="w-full h-[40vh]">
                            {eventCategories.map((item,index)=><DropdownMenuItem className="gap-x-2 hover:cursor-pointer" key={index} onClick={()=>{setValue('category',item),setDummy(dummy+1)}}>
                               {getValues('category')==item && <CheckIcon className="w-4 h-4"/>} <span>{t(item)}</span>
                            </DropdownMenuItem>)}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
                </FormProvider>
                <DialogFooter>
                    <Button /*disabled={isValid}*/ onClick={handleSubmit}>{isLoading ? <Loading/>: t('createNewPage')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}