import Link from "next/link"
import { useRef, useState } from "react"
import { useTruncatedElement } from '@faris/hooks/useTruncated'
import { useTranslation } from "next-i18next"
import { Button } from "../ui/button"
import { type TCreateNewComment } from "@faris/server/module/comment/comment.handler"
import { ThumbsUp } from "lucide-react"
import { api } from "@faris/utils/api"
import usePostStore from "zustandStore/postStore"
import ReplyNode from "./ReplyNode"
import useCommentReplyProcedureStore from "zustandStore/CommentReplyProcedureStore"
import useSessionStore from "zustandStore/userSessionStore"
import CustomAvatar from "../general/CustomAvatar"
import fromNow from "@faris/utils/fromNow"
import { PAGINATION } from "@faris/server/module/common/common.schema"

export default function CommentNode({ id,content, author,createdAt,_count,replyList }: TCreateNewComment) {
    const ref = useRef(null);
    const { t } = useTranslation()
    const {loadReply,currentReplyPageNumber,setCurrentReplyPageNumber,likeComment,dislikeComment} = usePostStore(state=>state)
    const {setReply} = useCommentReplyProcedureStore(state=>state)
    const userId = useSessionStore(state=>state.user.id)
    const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
        ref,
    });
    const [isLiked,setIsLiked] = useState(_count.LikeList>0?true:false)


    const {mutate} = api.comment.getReplyList.useMutation({
        onSuccess(data) {
            // add reply to comment at zustand store
            loadReply(data?.data.replyList??[],id)
        },
    })

    const {mutate:likeCommentMutation} = api.comment.likeOne.useMutation({
        onSuccess(data) {
            if(data.code==200){
                likeComment(userId,id,data.totalLikes)
                setIsLiked(true)
            }
        },
    })

    const {mutate:dislikeCommentMutation} = api.comment.dislikeOne.useMutation({
        onSuccess(data) {
            if(data.code==200){
                dislikeComment(id,data.totalLikes)
                setIsLiked(false)
            }
        },
    })

    const loadMoreReply = ()=>{
        mutate({page:currentReplyPageNumber,range:PAGINATION.COMMENTS,commentId:id,requesterId:userId})
        setCurrentReplyPageNumber(currentReplyPageNumber+1)
    }

    return (
        <div className='flex gap-x-2 p-2 '>
            <Link href={`/profile/${author?.id ?? ''}`}>
            <CustomAvatar imageUrl={author?.image?.url} alt={`@${author?.fullName}_profile_img`} />
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
            <div className="flex items-center text-[10px] gap-x-3">
                {/* <div  className=" capitalize hover:cursor-pointer hover:text-primary">{t('like')}</div> */}
                <div onClick={()=>isLiked ?  dislikeCommentMutation({userId,commentId:id}):likeCommentMutation({userId,commentId:id})} className="flex gap-x-1 hover:cursor-pointer"><ThumbsUp className={`w-3 h-3 ${isLiked?'text-red-400 fill-red-500':''}`}/><span>{_count?.LikeList??0}</span></div>
                <div onClick={()=>setReply({authorId:userId,commentId:id},'create',author.fullName)} className=" capitalize hover:cursor-pointer hover:text-primary">{t('reply')}</div>
                <div>{fromNow(createdAt)}</div>
            </div>
            {replyList.map((reply,i)=><ReplyNode commentId={id} key={i} {...reply}/>)}
            {replyList.length<_count.replyList && <Button variant={'link'} size={'sm'} onClick={loadMoreReply}>{t('showReplys')}</Button>}
            </section>
        </div>
    )
}
