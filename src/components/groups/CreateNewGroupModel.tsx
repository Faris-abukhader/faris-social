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
import CoverUploader from "../gettingStart/CoverUploader"
import { useGroupListStore } from "zustandStore/groupListStore"
import { type CreateNewGroup, createNewGroupSchema } from "@faris/server/module/group/group.schema"
import { Checkbox } from "../ui/checkbox"
import { createNewGroupInitialValues } from "@faris/server/module/group/group.initial"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { useToast } from "../ui/use-toast"

export const useGroupModel = modelStoreGenerator()

export default function CreateNewGroupModel() {
    const { show, setShow } = useGroupModel(state => state)
    const userSession = useSessionStore(state => state.user)
    const [dummy, setDummy] = useState(0)
    const { t } = useTranslation()
    const {toast} = useToast()
    const { createGroup } = useGroupListStore(state => state)

    const methods = useForm({
        resolver: valibotResolver(createNewGroupSchema),
        defaultValues: createNewGroupInitialValues as CreateNewGroup
    })

    const { getValues, setValue, register, formState: {  } } = methods

    const { mutate, isLoading } = api.group.createOne.useMutation({
        onSuccess(data) {
            createGroup(data)
            toast({
                title:t('groupWasCreatedSuccessfully')
            })
        },
        onSettled() {
            setShow(false)
        }
    })

    const handleSubmit = () => mutate({ ...getValues(), ownerId: userSession.id })

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="p-5 sm:max-w-[500px] sm:max-h-[480px] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className=" capitalize">{t('createNewGroup')}</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <ProfileUploader setImage={(img) => { setValue('profileImage.url', img.url); setValue('profileImage.path', img.path) }} />
                    <CoverUploader coverImage={getValues('coverImage.url')} setCoverImage={(img) => { setValue('coverImage.url', img.url); setValue('coverImage.path', img.path) }} />
                    <section className=" space-y-3">
                        <Input placeholder={t('groupName')} {...register('title')} />
                        <Input placeholder={t('groupBio')} {...register('about')} />
                        <Input placeholder={t('rules')} {...register('rules')} />
                        <div className="flex items-center gap-x-1">
                        <Checkbox checked={getValues('isPrivate')} onCheckedChange={(newValue)=>{setValue('isPrivate',newValue as boolean),setDummy(dummy + 1) }}/>
                        <label htmlFor="terms" className="px-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('isPrivate')}
                        </label>
                        <Checkbox checked={getValues('isVisiable')} onCheckedChange={(newValue)=>{setValue('isVisiable',newValue as boolean),setDummy(dummy + 1) }}/>
                        <label htmlFor="terms" className="px-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('isVisiable')}
                        </label>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">{getValues('category') ? t(getValues('category')) : t('selectCategory')}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <ScrollArea className="w-full h-[40vh]">
                                    {eventCategories.map((item, index) => <DropdownMenuItem className="gap-x-2 hover:cursor-pointer" key={index} onClick={() => { setValue('category', item), setDummy(dummy + 1) }}>
                                        {getValues('category') == item && <CheckIcon className="w-4 h-4" />} <span>{t(item)}</span>
                                    </DropdownMenuItem>)}
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                </FormProvider>
                <DialogFooter>
                    <Button /*disabled={isValid}*/ onClick={handleSubmit}>{isLoading ? <Loading /> : t('createNewGroup')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}