import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@faris/components/ui/dialog";
import { Button } from "@faris/components/ui/button";
import { type TGetOnePageReview } from "@faris/server/module/pageReview/pageReview.handler";
import { create } from "zustand";
import CustomAvatar from "@faris/components/general/CustomAvatar";
import { Rating } from "@smastrom/react-rating";
import { Textarea } from "@faris/components/ui/textarea";
import useSessionStore from "zustandStore/userSessionStore";
import { usePageReviewStore } from "./ReviewTab";
import { api } from "@faris/utils/api";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { type UpdateOnePageReviewParams, updateOnePageReviewSchema } from "@faris/server/module/pageReview/pageReview.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useToast } from "@faris/components/ui/use-toast";

export default function UpdateReviewModel() {
    const { data, show, setShow } = useUpdateReviewStore()
    const { t } = useTranslation()
    const {toast} = useToast()
    const { fullName, image } = useSessionStore(state => state.user)
    const updateReview = usePageReviewStore(state => state.updateOne)
    const [dummy, setDummy] = useState(0)
    const { mutate } = api.pageReivew.updateOne.useMutation({
        onSuccess(data) {
            updateReview(data)
            toast({
                title:t('pageReviewUpdatedSuccessfully')
            })
        },
        onSettled() {
            setShow(false)
        },
    })

    const { handleSubmit, setValue, getValues, register, reset } = useForm({
        resolver: valibotResolver(updateOnePageReviewSchema),
        defaultValues: data as UpdateOnePageReviewParams
    })

    const onSubmitHandler = (data: UpdateOnePageReviewParams) => {
        mutate(data)
        reset()
    }

    useEffect(()=>{
        data &&reset(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])
    
    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('updateReview')}</DialogTitle>
                </DialogHeader>
                <section className='flex items-center gap-x-2'>
                    <CustomAvatar imageUrl={image ?? undefined} alt={fullName} />
                    <h1>{fullName}</h1>
                </section>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form onSubmit={handleSubmit(onSubmitHandler)} className=' space-y-3'>
                    <Rating style={{ maxWidth: 120 }} value={getValues('rate')} onChange={(val: number) => { setValue('rate', val); setDummy(dummy + 1) }} />
                    <Textarea {...register('content')} placeholder={t('writeViewPlaceholder')} />
                    <Button type='submit'>{'confirm'}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export type UpdateReview = {
    data: TGetOnePageReview | undefined,
    show: boolean,
    setShow: (show: boolean) => void,
    open: (data: TGetOnePageReview) => void
}

export const useUpdateReviewStore = create<UpdateReview>((set) => ({
    data: undefined,
    show: false,
    setShow(show) {
        show ? set({ show }) : set({ show, data: undefined })
    },
    open(data) {
        set({ show: true, data })
    },
}))
