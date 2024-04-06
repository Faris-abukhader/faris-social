import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { CheckIcon, ChevronDown, Globe2, Lock, MapPin, PictureInPicture2, SmileIcon, TagIcon, Users2 } from "lucide-react"
import { useTranslation } from "next-i18next"
import useSessionStore from "zustandStore/userSessionStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Card } from "../ui/card"
import HoverButton from "../general/HoverButton"
import { ScrollArea } from "../ui/scroll-area"
import feelingsList from "@faris/utils/postFeeling"
import { FormProvider, useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { shareOnePostSchema, type ShareOnePost } from "@faris/server/module/post/post.schema"
import { api } from "@faris/utils/api"
import { usePostListStore } from "zustandStore/postListStore"
import { create } from "zustand"
import { type GetOnePost } from "@faris/server/module/post/post.handler"
import SharedPostWidget from "./SharedPostWidget"
import CustomAvatar from "../general/CustomAvatar"
import { sharePostInitialValues } from "@faris/server/module/post/post.initial"
import { useToast } from "../ui/use-toast"

const privacyList = [
    {
        title: 'friends',
        icon: <Users2 className="w-3 h-3" />
    },
    {
        title: 'public',
        icon: <Globe2 className="w-3 h-3" />
    },
    {
        title: 'onlyMe',
        icon: <Lock className="w-3 h-3" />
    }
]

export const getPrivacyIcon = (privacy:string) =>{
    switch(privacy){
        case 'friends':
            return <Users2 className="w-3 h-3" />
        case 'public':
            return <Globe2 className="w-3 h-3" />
        case 'onlyMe':
            return <Lock className="w-3 h-3" />
        default:
            return <Users2 className="w-3 h-3" />
    }
}

export function SharePostModel() {
    const { t } = useTranslation()
    const {toast} = useToast()
    const { post,showModel, setShowModel,isResharedPost,reset } = useSharePostModel(state => state)
    const userSession = useSessionStore(state => state.user)
    const [privacyIcon, setPrivacyIcon] = useState<JSX.Element>(<Users2 className="w-3 h-3" />)
    const [feelingIcon, setFeelingIcon] = useState<string | null>(null)
    const addPost = usePostListStore(state => state.addPost)
    const { mutate } = api.post.sharePost.useMutation({
        onSuccess(data) {
            addPost(data)
            // reset the share post state holder
            reset()
            toast({
                title:t('postSharedSuccessfully')
            })
        },
    })

    const methods = useForm({
        resolver: valibotResolver(shareOnePostSchema),
        defaultValues: sharePostInitialValues as ShareOnePost
    })

    const { handleSubmit, getValues, setValue, register, formState: { isValid } } = methods

    useEffect(() => {
        setValue('authorId', userSession.id)
        setValue('postId', post?.id??'')
        setValue('accountHolderId', userSession.id)
    }, [post, setValue, userSession.id])


    const createNewPost = (data: ShareOnePost) => {
        mutate({...data,isResharedPost})
        setShowModel(false)
    }

    return (
        <Dialog open={showModel} onOpenChange={setShowModel}>
            <DialogContent className="sm:max-w-[500px] h-screen sm:h-fit">
                <FormProvider {...methods}>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <form onSubmit={handleSubmit(createNewPost)}>
                        <ScrollArea className="w-full h-[90vh] sm:h-80">
                        <DialogHeader>
                            <DialogTitle className="capitalize">{t('createNewPost')}</DialogTitle>
                        </DialogHeader>
                            <div className="h-full space-y-4">
                                <div className="flex items-center gap-x-2 pt-2">
                                <CustomAvatar imageUrl={userSession.image??undefined} alt={`@${userSession.fullName}_profile_img`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-x-1">
                                            <h1 className="capitalize">{userSession.fullName}</h1>
                                            {getValues().checkIn && <div className="text-xs opacity-75">{t('at')}{' '}{getValues().checkIn?.location}</div>}
                                            {getValues().feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` ${feelingIcon ? feelingIcon : ''} `}{getValues().feeling}</div>}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size={'sm'} className="h-6 text-xs gap-x-1" variant="outline"><>{privacyIcon}</><span>{t(getValues('whoCanSee')??'')}</span><ChevronDown className="w-3 h-3" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-44">
                                                <DropdownMenuLabel>{t('whoCanSeePost')}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    {privacyList.map((item, index) => <DropdownMenuItem key={index} className="gap-x-1" onClick={() => { setPrivacyIcon(item.icon); setValue('whoCanSee', item.title) }}>
                                                        {item.icon == privacyIcon && <CheckIcon className="w-3 h-3" />}
                                                        {item.icon}
                                                        <span>{t(item.title)}</span>
                                                    </DropdownMenuItem>)}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <Textarea {...register('content')} placeholder={t('whatOnYourMind', { username: userSession.fullName })} className="col-span-3 h-32 resize-none" />
                               {post && <SharedPostWidget isResharedSharedPost={false} {...post}/>}
                                <Card className="w-full flex items-center justify-between p-4">
                                    <p className="text-sm">{t('addToYourPost')}</p>
                                    <label htmlFor="upload_media_for_post" className="hover:cursor-pointer"><input className="hidden" id='upload_media_for_post' type="file" /></label>
                                    <div className="flex items-center gap-x-1">
                                        <HoverButton hoverContent={t('photo/video')} disabled={true}><PictureInPicture2 className="w-4 h-4 fill-gray-500 text-gray-300" /></HoverButton>
                                        <HoverButton hoverContent={t('tagSomeone')}><TagIcon className="w-4 h-4 fill-blue-500 text-blue-300" /></HoverButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <HoverButton hoverContent={t('feelings')}><SmileIcon className="w-4 h-4 fill-orange-500 text-orange-300" /></HoverButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-44- w-fit">
                                                <ScrollArea className="w-full h-80">
                                                    {feelingsList.map((feeling, i) => <DropdownMenuItem key={i} className="gap-x-1 hover:cursor-pointer" onClick={() => { setValue('feeling', feeling.feeling), setFeelingIcon(feeling.icon) }}>
                                                        <div>{feeling.icon}</div>
                                                        <span>{feeling.feeling}</span>
                                                    </DropdownMenuItem>)}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <HoverButton hoverContent={t('location')}><MapPin className="w-4 h-4 fill-red-500 text-red-300" /></HoverButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-44- w-fit">
                                                <ScrollArea className="w-full h-fit max-h-80">
                                                    {['yiwu', 'hanzghou', 'shanghai'].map((location, i) => <DropdownMenuItem key={i} className="gap-x-1" onClick={() => setValue('checkIn.location', location)}>
                                                        <div>{location}</div>
                                                    </DropdownMenuItem>)}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Card>
                            </div>
                            <DialogFooter className="pt-4">
                            {/* for debugging */}
                            {/* <pre>{JSON.stringify(errors,null,2)}</pre>*/}
                            {/* <pre>{JSON.stringify(getValues(),null,2)}</pre>  */}
                            <Button disabled={!isValid || false} type="submit">{t('post')}</Button>
                        </DialogFooter>
                        </ScrollArea>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}



type SharePostModel = {
    post: GetOnePost | null,
    isResharedPost:boolean,
    setPost: (post: GetOnePost,isResharedPost:boolean) => void
    showModel: boolean,
    setShowModel: (newValue: boolean) => void
    reset:()=>void
}

export const useSharePostModel = create<SharePostModel>((set) => ({
    post: null,
    showModel: false,
    isResharedPost:false,
    setPost(post,isResharedPost) {
        set({ post,isResharedPost })
    },
    setShowModel(showModel) {
        set({ showModel })
    },
    reset() {
        set({post:null,showModel:false,isResharedPost:false})
    },
}))
