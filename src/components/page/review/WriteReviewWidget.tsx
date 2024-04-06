import { Card } from '@faris/components/ui/card'
import  { useState } from 'react'
import useSessionStore from 'zustandStore/userSessionStore'
import { Textarea } from '@faris/components/ui/textarea'
import { Button } from '@faris/components/ui/button'
import { useTranslation } from 'next-i18next';import { useForm } from 'react-hook-form'
import { type WritePageReviewParams, writePageReviewSchema } from '@faris/server/module/pageReview/pageReview.schema'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { api } from '@faris/utils/api'
import { usePageReviewStore } from './ReviewTab'
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import CustomAvatar from '@faris/components/general/CustomAvatar'
import { writePageReviewInitialValues } from '@faris/server/module/pageReview/pageReview.initial'
import { useToast } from '@faris/components/ui/use-toast'

interface WriteReviewWidgetProps {
    pageId:string
}
export default function WriteReviewWidget({pageId}:WriteReviewWidgetProps) {
    const {t} = useTranslation()
    const {toast} = useToast()
    const { fullName, id, image } = useSessionStore(state => state.user)
    const {createOne} = usePageReviewStore(state=>state)
    const [dummy,setDummy] = useState(0)
    const {mutate} = api.pageReivew.createOne.useMutation({
        onSuccess(data) {
            createOne(data)
            toast({
                title:t('pageReviewWasSharedSuccessfully')
            })
        },
    })

    const { handleSubmit, setValue,getValues, register,reset } = useForm({
        resolver: valibotResolver(writePageReviewSchema),
        defaultValues: writePageReviewInitialValues(pageId,id) as WritePageReviewParams
    })

    const onSubmitHandler = (data:WritePageReviewParams)=>{
        mutate({...data,pageId,authorId:id})
        reset()
    }
 
    return (
        <Card className='p-4 space-y-3'>
            <section className='flex items-center gap-x-2'>
            <CustomAvatar imageUrl={image??undefined} alt={fullName} />
                <h1>{fullName}</h1>
            </section>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={handleSubmit(onSubmitHandler)} className=' space-y-3'>
                <Rating style={{maxWidth:120}} value={getValues('rate')} onChange={(val:number)=>{setValue('rate',val);setDummy(dummy+1)}}/>
            <Textarea {...register('content')} placeholder={t('writeViewPlaceholder')}/>
            <Button type='submit'>{'publish'}</Button>
            </form>
        </Card>
    )
}
