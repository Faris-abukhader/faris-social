import { FormEvent, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Check } from 'lucide-react'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import usePostStore from 'zustandStore/postStore'
import useCommentReplyProcedureStore from 'zustandStore/CommentReplyProcedureStore'
import WriteCommentSkeleton from '../skeleton/WriteCommentSkeleton'
import CustomAvatar from './CustomAvatar'
import { useToast } from '../ui/use-toast'

interface WriteCommentProps {
    postId: string
    isSharedPost:boolean
}
export default function WriteComment({ postId ,isSharedPost}: WriteCommentProps) {
    const { t } = useTranslation()
    const {toast} = useToast()
    const [dummy, setDummy] = useState(0)
    const { user, isReady } = useSessionStore(state => state)
    const { addComment, addReply } = usePostStore(state => state)
    const { target, reply, reset, setContent, content, commentOwner } = useCommentReplyProcedureStore(state => state)
    const [isValid, setIsValid] = useState(false)
    const { mutate: createNewComment } = api.comment.createNew.useMutation({
        onSuccess(data) {
            // add the new comment to zustand post list
            addComment(data)
            // reset comment state
            reset()
            // to force UI to rerunder
            setDummy(dummy + 1)
            // fire a toast
            toast({
                title:t('newCommentWasSharedSuccessfully')
            })
        },
        onError(error) {
            if(error.message=='RATELIMIT_EXCEEDED'){
                toast({
                    variant:'destructive',
                    title:t('rateLimitDescription')
                })
            }
        },
    })

    const { mutate: createNewReply } = api.reply.createNew.useMutation({
        onSuccess(data) {
            // add the new reply to zustand post list
            if (!reply) return
            addReply(data, reply.commentId)
            // reset comment state
            reset()
            // to force UI to rerunder
            setDummy(dummy + 1)
        },
        onError(error) {
            if(error.message=='RATELIMIT_EXCEEDED'){
                toast({
                    variant:'destructive',
                    title:t('rateLimitDescription')
                })
            }
        },
    })

    useEffect(() => {
        setIsValid(content.length > 1 && content.length < 250 ? true : false)
    }, [content.length])


    const handleClick = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (target == 'comment') {
            createNewComment({ postId,isSharedPost, authorId: user.id, content })
        } else {
            createNewReply({ commentId: reply?.commentId ?? '', authorId: reply?.authorId ?? '', content })
        }
    }

    if (!isReady) return <WriteCommentSkeleton />

    return (
        <div className='flex w-full gap-x-2 px-1 py-2'>
                <CustomAvatar className='w-8 h-8' alt={user?.fullName} imageUrl={user.image??undefined}/>
            <form onSubmit={handleClick} className='w-full flex items-center ps-2 gap-x-2 rounded-full border bg-popover'>
                <input value={content} onChange={(e) => setContent(e.target.value)} placeholder={target == 'comment' ? t('writeCommentPlaceHolder') : t('replyPlaceholder', { name: commentOwner })} className='w-full py-2 text-xs text-[16px] hidden sm:block border-none bg-transparent hover:outline-none focus:outline-none' />
                <Button type='submit' disabled={!isValid} variant={'ghost'} className='rounded-full p-0 w-8 h-8'>
                    <Check className='w-5 h-5' />
                </Button>
            </form>
        </div>
    )
}
