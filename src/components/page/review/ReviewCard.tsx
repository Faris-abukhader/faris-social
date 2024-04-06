import { type TGetOnePageReview } from '@faris/server/module/pageReview/pageReview.handler'
import { PencilIcon, StarIcon } from 'lucide-react'
import { Card } from '@faris/components/ui/card'
import CustomAvatar from '@faris/components/general/CustomAvatar'
import fromNow from '@faris/utils/fromNow'
import useSessionStore from 'zustandStore/userSessionStore'
import { Button } from '@faris/components/ui/button'
import { useUpdateReviewStore } from './UpdateReviewModel'

export default function ReviewCard({id,author, rate, content, createdAt }: TGetOnePageReview) {
    const userId = useSessionStore(state=>state.user.id)
    const openUpdateReviewModel = useUpdateReviewStore(state=>state.open)
    return (
        <Card className='p-4 relative'>
            <section className='flex items-start justify-between'>
                <div className='flex items-center gap-x-2'>
                    <CustomAvatar imageUrl={author.image?.url} alt={author.fullName} />
                    <div className='space-y-1'>
                        <h1>{author.fullName}</h1>
                        <p className='text-xs text-opacity-70'>{fromNow(createdAt)}</p>
                    </div>
                </div>
                <div className='flex items-center gap-x-1'>
                {Array.from({length:rate}).map((_,i)=><StarIcon key={i} className='w-3 h-3 text-yellow-400 fill-yellow-400'/>)}
                {userId==author.id && <Button onClick={()=>openUpdateReviewModel({id,author, rate, content, createdAt })} className='w-fit h-fit p-[6px] rounded-full' size={'sm'} variant={'outline'}><PencilIcon className='w-3 h-3'/></Button>}
                </div>
            </section>
            <section className='p-4 text-sm'>
                <p>{content}</p>
            </section>
        </Card>
    )
}
