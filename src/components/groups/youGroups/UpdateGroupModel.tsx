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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@faris/components/ui/dropdown-menu"
import { CheckIcon } from "lucide-react"
import { api } from "@faris/utils/api"
import Loading from "@faris/components/general/Loading"
import { ScrollArea } from "@faris/components/ui/scroll-area"
import { useEffect, useState } from "react"
import eventCategories from "@faris/utils/eventCategories"
import { useGroupListStore } from "zustandStore/groupListStore"
import { updateOneGroupSchema, type UpdateOneGroup } from "@faris/server/module/group/group.schema"
import { Checkbox } from "@faris/components/ui/checkbox"
import { updateGroupInitialValues } from "@faris/server/module/group/group.initial"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { type TGetOneGroup } from "@faris/server/module/group/group.handler"
import { useToast } from "@faris/components/ui/use-toast"

export const useUpdateGroupModel = modelStoreGenerator<TGetOneGroup>()
export default function UpdateGroupModel() {
    const { show, setShow,data:currentGroup } = useUpdateGroupModel(state => state)
    const [dummy, setDummy] = useState(0)
    const { t } = useTranslation()
    const {toast} = useToast()
    const updateGroup = useGroupListStore(state => state.updateGroup)

    const methods = useForm({
        resolver: valibotResolver(updateOneGroupSchema),
        defaultValues: updateGroupInitialValues as  UpdateOneGroup
    })

    const { getValues, setValue, register,reset, formState: { } } = methods

    useEffect(()=>{
        currentGroup && reset(currentGroup as UpdateOneGroup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentGroup])

    const { mutate, isLoading } = api.group.updateOne.useMutation({
        onSuccess(data) {
            updateGroup(data.id,data)
            toast({
                title:t('groupUpdatedSuccessfully')
            })
        },
        onSettled() {
            setShow(false)
        }
    })

    const handleSubmit = () => mutate({ ...getValues()})

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="p-5 sm:max-w-[500px] sm:max-h-[480px] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className=" capitalize">{t('updateGroup')}</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <section className=" space-y-3">
                        <Input placeholder={t('groupName')} {...register('title')} />
                        <Input placeholder={t('groupBio')} {...register('about')} />
                        <Input placeholder={t('rules')} {...register('rules')} />
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
                    </section>
                </FormProvider>
                <DialogFooter>
                    <Button onClick={handleSubmit}>{isLoading ? <Loading /> : t('updateGroup')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}