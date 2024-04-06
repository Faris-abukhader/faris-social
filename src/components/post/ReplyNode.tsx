import Link from "next/link"
import { useRef, useState } from "react"
import { useTruncatedElement } from '@faris/hooks/useTruncated'
import { useTranslation } from "next-i18next"
import { Button } from "../ui/button"
import { ThumbsUp } from "lucide-react"
import { type TCreateNewReply } from "@faris/server/module/reply/reply.handler"
import usePostStore from "zustandStore/postStore"
import { api } from "@faris/utils/api"
import useSessionStore from "zustandStore/userSessionStore"
import CustomAvatar from "../general/CustomAvatar"
import fromNow from "@faris/utils/fromNow"

interface ReplyNodeProps extends TCreateNewReply { 
    commentId:string
}
export default function ReplyNode({id,commentId,content, author,createdAt,_count }: ReplyNodeProps) {
    const ref = useRef(null);
    const { t } = useTranslation()
    const userId = useSessionStore(state=>state.user.id)
    const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
        ref,
    });
    const {likeReply,dislikeReply} = usePostStore(state=>state)
    const [isLiked,setIsLiked] = useState(_count.likeList>0?true:false)
    const [totalLikes,setTotalLikes] = useState(_count.likeList)

    const {mutate:likeReplyMutation} = api.reply.likeOne.useMutation({
        onSuccess(data) {
            if(data.code===200){
                likeReply(userId,commentId,id,data.totalLike)
                setIsLiked(true)
                setTotalLikes(data.totalLike)
            }
        },
    })

    const {mutate:dislikeReplyMutation} = api.reply.dislikeOne.useMutation({
        onSuccess(data) {
            if(data.code===200){
                dislikeReply(userId,commentId,data.totalLike)
                setIsLiked(false)
                setTotalLikes(data.totalLike)
            }
        },
    })

    return (
        <div className='flex gap-x-2 p-2 '>
            <Link href={`/profile/${author?.id ?? ''}`}>
                <CustomAvatar className='w-8 h-8' imageUrl={author?.image?.url} alt={`@${author?.fullName??''}_profile_img`} />
            </Link>
            <section>
            <div className=' p-4 rounded-xl bg-zinc-200 dark:bg-slate-900 text-popover-foreground'>
                <h1 className='pb-2 capitalize text-xs'>{author?.fullName}</h1>
                <p ref={ref} className={`break-words text-[10px] ${isReadingMore ? '' : 'line-clamp-3'}`}>
                    {content}
                </p>
                {isTruncated && !isReadingMore && (
                    <Button size={'sm'} variant={'outline'} className=" mt-4 text-xs p-1 h-fit" onClick={() => setIsReadingMore(true)}>{t('seeMore')}</Button>
                )}
            </div>
            <div className="flex items-center justify-start text-[10px] gap-x-3">
                <div onClick={()=>isLiked ? dislikeReplyMutation({userId,replyId:id}):likeReplyMutation({userId,replyId:id})} className="flex gap-x-1 hover:cursor-pointer"><ThumbsUp className={`w-3 h-3 ${isLiked?'text-red-400 fill-red-500':''}`}/><span>{totalLikes}</span></div>
                <div>{fromNow(createdAt)}</div>
            </div>
            </section>
        </div>
    )
}
