import React from 'react'
import { Card } from '../ui/card'
import { useTranslation } from 'next-i18next';import { type GetOnePost } from '@faris/server/module/post/post.handler'
import Image from 'next/image'
import { getPrivacyIcon } from './SharePostModel'
import usePostStore from '../../../zustandStore/postStore'
import CustomAvatar from '../general/CustomAvatar'

interface SharedPostWidgetProps extends GetOnePost {
    isResharedSharedPost:boolean
}
export default function SharedPostWidget({id,type,_count,createdAt,commentList,mentionList,likeList,mediaList,userAuthor,pageAuthor,checkIn,feeling,whoCanSee,content,hashtagList,isResharedSharedPost,language }: SharedPostWidgetProps) {
    const { t } = useTranslation()
    const { setPost } = usePostStore(state => state)
    
    const seeFullPost = () => setPost({ id ,type, userAuthor,pageAuthor, content, _count, createdAt, commentList, mentionList,whoCanSee, likeList, mediaList,hashtagList, checkIn, feeling,language},isResharedSharedPost)


    return (
        <Card onClick={seeFullPost}>
            {mediaList && mediaList.length > 0 && <Image src={mediaList.at(0)?.url ?? ''} width={500} height={500} className='w-full h-96 rounded-t-md' alt='post_image' />}
            <div className="p-5">
                <section className="flex items-center gap-x-2 pt-2">
                <CustomAvatar imageUrl={userAuthor?.image?.url} alt={`@${userAuthor?.fullName??''}_profile_img`} />
                    <div className="space-y-1">
                        <div className="flex items-center gap-x-1">
                            <h1 className="capitalize">{userAuthor?.fullName}</h1>
                            {checkIn && <div className="text-xs opacity-75">{t('at')}{' '}{checkIn.location}</div>}
                            {feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` `}{feeling}</div>}
                        </div>
                        <div className="h-6 text-xs gap-x-1 flex items-center"><>{getPrivacyIcon(whoCanSee)}</><span>{t(whoCanSee)}</span></div>
                    </div>
                </section>
                <p className='py-4 text-xs text-opacity-75 line-clamp-5'>{content}</p>
            </div>
        </Card>
    )
}
