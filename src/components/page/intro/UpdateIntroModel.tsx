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
import { type UpdatePageIntroParams, updatePageIntroSchema } from "@faris/server/module/page/page.schema"
import { api } from "@faris/utils/api"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@faris/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "next-i18next"
import { Textarea } from "@faris/components/ui/textarea"
import { updatePageIntroInitialValues } from "@faris/server/module/page/page.initial"
import { modelStoreGenerator } from "zustandStore/modelStore"
import { useToast } from "@faris/components/ui/use-toast"

const currency = ['$', '€', '¥', '¢', '£', '₽', '﷼'] as const

export const useIntroModel = modelStoreGenerator<UpdatePageIntroParams>()

export default function UpdateIntroModel() {
    const { t } = useTranslation()
    const {toast} = useToast()
    const { show, setShow,data } = useIntroModel(state => state)
    const [price, setPrice] = useState({
        from: 0,
        to: 0,
        currency: '$'
    })

    useEffect(()=>{
        data?.priceRange && setPrice(data.priceRange)
        data && reset(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])

    useEffect(() => {
        setValue('priceRange', price)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [price,data])

    const { mutate, isLoading } = api.page.updateIntro.useMutation({
        onSettled() {
            setShow(false)
            reset()
            toast({
                title:t('pageIntroUpdatedSuccessfully')
            })
        },
    })

    const { setValue,getValues, register, reset, formState: {  } } = useForm({
        resolver: valibotResolver(updatePageIntroSchema),
        defaultValues: updatePageIntroInitialValues as UpdatePageIntroParams
    })

    const onSubmitHandler = () => mutate(getValues())


    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('updatePageInfo')}</DialogTitle>
                </DialogHeader>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <div className="space-y-2">
                    <div>
                        <Label>{t('about')}</Label>
                        <Textarea {...register('about')} />
                    </div>
                    <div>
                        <Label>{t('serviceArea')}</Label>
                        <Input {...register('serviceArea')} />
                    </div>
                    <div>
                        <Label>{t('email')}</Label>
                        <Input {...register('email')} />
                    </div>
                    <div>
                        <Label>{t('websiteUrl')}</Label>
                        <Input {...register('website_url')} />
                    </div>
                    <div>
                        <Label>{t('priceRange')}</Label>
                        <div className="flex items-center gap-x-2">
                            <Input value={price.from} onChange={(e) => setPrice((prevs) => ({ ...prevs, from: Number(e.target.value) }))} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">{price.currency}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    {currency.map((currency,index)=><DropdownMenuItem key={index} onClick={()=>setPrice(prevs=>({...prevs,currency}))}>
                                        <span>{currency}</span>
                                    </DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Input value={price.to} onChange={(e) => setPrice((prevs) => ({ ...prevs, to: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isLoading} onClick={onSubmitHandler} type="submit">{isLoading ? <Loading /> : t('confirm')}</Button>
                    </DialogFooter>
                </div>
                <p className="text-xs text-red-300 dark:text-red-900">{t('updatedDataMayNeedFewMinutes')}</p>
            </DialogContent>
        </Dialog>
    )
}