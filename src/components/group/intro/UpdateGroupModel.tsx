import Loading from "@faris/components/general/Loading"
import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { Label } from "@faris/components/ui/label"
import { api } from "@faris/utils/api"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "next-i18next"
import { Textarea } from "@faris/components/ui/textarea"
import { type UpdateGroupIntroParams, updateGroupIntroSchema } from "@faris/server/module/group/group.schema"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@faris/components/ui/dropdown-menu"
import eventCategories from "@faris/utils/eventCategories"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { CheckIcon } from "lucide-react"
import { Checkbox } from "@faris/components/ui/checkbox"
import { updateGroupIntroInitialValues } from "@faris/server/module/group/group.initial"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { useToast } from "@faris/components/ui/use-toast"

export const useGroupIntroModel = modelStoreGenerator<UpdateGroupIntroParams>()

export default function UpdateGroupIntroModel() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const [dummy, setDummy] = useState(0)
    const { show, setShow, data } = useGroupIntroModel(state => state)

    useEffect(() => {
        data && reset(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const { mutate, isLoading } = api.group.updateIntro.useMutation({
        onSettled() {
            setShow(false)
            reset()
            toast({
                title:t('groupIntroUpdatedSuccessfully')
            })
        },
    })

    const { handleSubmit, setValue, getValues, register, reset, formState: { } } = useForm({
        resolver: valibotResolver(updateGroupIntroSchema),
        defaultValues: updateGroupIntroInitialValues as UpdateGroupIntroParams
    })

    const onSubmitHandler = (data: UpdateGroupIntroParams) => mutate(data)

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('updatePageInfo')}</DialogTitle>
                </DialogHeader>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form className=" space-y-2" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div>
                        <Label>{t('title')}</Label>
                        <Input {...register('title')} />
                    </div>
                    <div>
                        <Label>{t('about')}</Label>
                        <Textarea {...register('about')} />
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
                    <div>
                        <Label>{t('rules')}</Label>
                        <Input {...register('rules')} />
                    </div>
                    <Checkbox checked={getValues('isPrivate')} onCheckedChange={(newValue) => { setValue('isPrivate', newValue as boolean), setDummy(dummy + 1) }} />
                    <label htmlFor="terms" className="px-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t('isPrivate')}
                    </label>
                    <Checkbox checked={getValues('isVisiable')} onCheckedChange={(newValue) => { setValue('isVisiable', newValue as boolean), setDummy(dummy + 1) }} />
                    <label htmlFor="terms" className="px-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t('isVisiable')}
                    </label>
                    <div>
                        <Label>{t('location')}</Label>
                        <Input {...register('location')} />
                    </div>
                    <DialogFooter>
                        <Button disabled={isLoading} type="submit">{isLoading ? <Loading /> : t('confirm')}</Button>
                    </DialogFooter>
                </form>
                <p className="text-xs text-red-300 dark:text-red-900">{t('updatedDataMayNeedFewMinutes')}</p>
            </DialogContent>
        </Dialog>
    )
}