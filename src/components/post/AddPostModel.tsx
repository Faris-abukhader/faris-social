import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { CheckIcon, ChevronDown, MapPin, PictureInPicture2, SmileIcon, Users2 } from "lucide-react"
import { useTranslation } from "next-i18next"
import useSessionStore from "zustandStore/userSessionStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Card } from "../ui/card"
import HoverButton from "../general/HoverButton"
import ImageUploader from "./ImagesUploader"
import { ScrollArea } from "../ui/scroll-area"
import feelingsList from "@faris/utils/postFeeling"
import { FormProvider, useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { type CreateNewPost, createNewPostSchema, type CreateNewPagePostParams } from "@faris/server/module/post/post.schema"
import { api } from "@faris/utils/api"
import { usePostListStore } from "zustandStore/postListStore"
import { create } from "zustand"
import { privacyList } from "./privacyList"
import CustomAvatar from "../general/CustomAvatar"
import { type TGetOneMiniPage } from "@faris/server/module/page/page.handler"
import { createNewPostInitialValues } from "@faris/server/module/post/post.initial"
import { useGroupPostListStore } from "zustandStore/groupPostListStore"
import { type CreateNewGroupPostParams } from "@faris/server/module/group/group.schema"
import Loading from "../general/Loading"
import { Checkbox } from "@faris/components/ui/checkbox"
import { useToast } from "../ui/use-toast"
import { safeParse } from "valibot"

export function AddPostModel() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const { showModel, setShowModel, page, authorType, holderType, groupId, location, setLocation, withLocation, setWithLocation,pageId } = usePostModel(state => state)
    const userSession = useSessionStore(state => state.user)
    const [privacyIcon, setPrivacyIcon] = useState<JSX.Element>(<Users2 className="w-3 h-3" />)
    const [showImage, setShowImage] = useState(false)
    const [feelingIcon, setFeelingIcon] = useState<string | null>(null)
    const addPost = usePostListStore(state => state.addPost)
    const addGroupPost = useGroupPostListStore(state => state.addPost)
    const [dummy, setDummy] = useState(0)
    const [isGettingCoordinate, setIsGettingCoordinate] = useState(false)
    const [isValid,setIsValid] = useState(false)
    const { mutate, isLoading } = api.post.createNewPost.useMutation({
        onSuccess(data) {
            addPost(data)
            toast({
                title: t('newPostWasSharedSuccessfully')
            })
        },
        onError(error) {
            console.log(JSON.stringify(error,null,2))
        },
        onSettled() {
            setShowModel(false)
        },
    })


    const { mutate:newPagePostMutate, isLoading:isPagePostLoading } = api.page.createPost.useMutation({
        onSuccess(data) {
            addPost(data)
            toast({
                title: t('newPostWasSharedSuccessfully')
            })
        },
        onSettled() {
            setShowModel(false)
        },
    })
    const { mutate: groupMutate, isLoading: isCreating } = api.group.createPost.useMutation({
        onSuccess(data) {
            addGroupPost(data)
            toast({
                title: t('newPostWasSharedSuccessfully')
            })
        },
        onSettled() {
            setShowModel(false)
        },
    })
    const { mutate: gettingCityName, isLoading: isGettingCityName } = api.location.getCityName.useMutation({
        onSuccess(data) {
            if (data && data.at(0) != undefined) {
                const local = (userSession.platformLanguage ?? 'en')
                setLocation(data.at(0)?.local_names[local] as string)
                setValue('checkIn.location', data.at(0)?.local_names[local] as string)
            }
            console.log({ data })
        },
    })

    useEffect(() => {

        const getNearbyPlaces = () => {
            setIsGettingCoordinate(true)
            navigator.geolocation.getCurrentPosition((position) => {
                const location = { altitude: position.coords.latitude, longitude: position.coords.longitude }
                gettingCityName(location)
            }, (error) => {
                console.log(error)
                return;
            })
            setIsGettingCoordinate(false)
        }

        // make sure that city was not add already
        if (withLocation && location == null) {
            getNearbyPlaces()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSession, withLocation])

    const methods = useForm({
        resolver: valibotResolver(createNewPostSchema),
        defaultValues: createNewPostInitialValues as CreateNewPost
    })

    const { handleSubmit, getValues, setValue, trigger, formState: { errors } } = methods

    useEffect(() => {
        void trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId])

    useEffect(() => {
        setValue('authorId', userSession.id)
        holderType == 'page' && setValue('pageId', pageId ?? '')
        holderType == 'page' && setValue('accountHolderId', pageId ?? '')
        holderType == 'group' && setValue('groupId', groupId ?? '')
        holderType == 'group' && setValue('accountHolderId', groupId ?? '')
        holderType == 'user' && setValue('accountHolderId', userSession.id)
        setValue('authorId', page ? page.id : userSession.id)
        setValue('authorType', authorType)
        setValue('holderType', holderType)
    }, [setValue, page, userSession.id, authorType, holderType, groupId, pageId])

    const createNewPost = (data: (CreateNewPost | CreateNewGroupPostParams|CreateNewPagePostParams)) => {
        if (groupId) {
            console.log(data)
            groupMutate(data as CreateNewGroupPostParams)
        } else if(holderType=='page') {
            newPagePostMutate(data as CreateNewPagePostParams)
        }else{
            mutate(data as CreateNewPost)
        }
    }

    useEffect(() => {
        console.log({ withLocation })
        withLocation ? setValue('checkIn.location', location ?? '') : setValue('checkIn', undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withLocation])

    const handleChange = (content: string) => {
        const hashtags: string[] | null = content.match(/#[a-zA-Z0-9_]+/g);

        // Process hashtags as needed, you can console log them for now
        console.log('Hashtags:', hashtags);

        // Remove hashtags from the content
        const contentWithoutHashtags = content.replace(/#[a-zA-Z0-9_]+/g, '');

        // Process the rest of the text
        console.log('Content without hashtags:', contentWithoutHashtags);

        setValue('content', contentWithoutHashtags)
        hashtags && hashtags.length > 0 && setValue('hashtagList', hashtags.map(hashtag => ({ title: hashtag })))

    };

    useEffect(()=>{
        if(showModel){
            const result = safeParse(createNewPostSchema,getValues())
            // setDummy(dummy+1)
            setIsValid(result.success)
            console.log(result)    
        }
    },[getValues(),showModel])

    return (
        <Dialog  open={showModel} onOpenChange={setShowModel}>
            <DialogContent /*className="sm:max-w-[500px] h-screen max-h-[70vh] sm:h-[70vh]"*/>
                <FormProvider {...methods}>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <form onSubmit={handleSubmit(createNewPost)}>
                        <DialogHeader>
                            <DialogTitle className="capitalize">{t('createNewPost')}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="w-full h-screen max-h-[60vh] sm:h-80">
                            <div className="h-full space-y-4">
                                <div className="flex items-center gap-x-2 pt-2">
                                    <CustomAvatar imageUrl={page ? page.profileImage?.url : userSession.image ?? undefined} alt={`@${page ? page.title : userSession.fullName}_profile_img`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-x-1">
                                            <h1 className="capitalize">{page ? page.title : userSession.fullName}</h1>
                                            {!page && getValues().checkIn && <div className="text-xs opacity-75">{(isGettingCityName || isGettingCoordinate) ? <Loading className="w-4 h-4" /> : <>{t('at')}{' '}{getValues().checkIn?.location}</>}</div>}
                                            {getValues().feeling && <div className="text-xs opacity-75">{t('isFeeling')}{` ${feelingIcon ? feelingIcon : ''} `}{getValues().feeling}</div>}
                                        </div>
                                        {!page && holderType != 'group' && <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size={'sm'} className="h-6 text-xs gap-x-1" variant="outline"><>{privacyIcon}</><span>{t(getValues('whoCanSee') ?? '')}</span><ChevronDown className="w-3 h-3" /></Button>
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
                                        </DropdownMenu>}
                                    </div>
                                </div>
                                <Textarea onChange={e => handleChange(e.target.value)} placeholder={t('whatOnYourMind', { username: page ? page.title : userSession.fullName })} className="col-span-3 h-32 resize-none" />
                                {showImage && <ImageUploader />}
                                <Card className="w-full flex items-center justify-between p-4">
                                    <p className="text-sm">{t('addToYourPost')}</p>
                                    <label htmlFor="upload_media_for_post" className="hover:cursor-pointer"><input className="hidden" id='upload_media_for_post' type="file" /></label>
                                    <div className="flex items-center gap-x-1">
                                        <HoverButton hoverContent={t('photo/video')} onClick={() => setShowImage(true)}><PictureInPicture2 className="w-4 h-4 fill-green-500 text-green-300" /></HoverButton>
                                        {/* has possiblity to add this feature <<Tag someone to the post>> */}
                                        {/* {!page && holderType != 'group' && <HoverButton hoverContent={t('tagSomeone')}><TagIcon className="w-4 h-4 fill-blue-500 text-blue-300" /></HoverButton>} */}
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
                                        {<DropdownMenu>
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
                                        </DropdownMenu>}
                                    </div>
                                </Card>
                                <div className="flex items-center gap-x-2">
                                    <Checkbox checked={withLocation} onCheckedChange={(v) => { setWithLocation(Boolean(v)); setDummy(dummy + 1) }} id="withLocation" />
                                    <label htmlFor="withLocation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t('showLocation')}
                                    </label>
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="pt-4">
                            <Button disabled={isGettingCityName || isGettingCoordinate || isLoading || isCreating || isPagePostLoading || !isValid} type="submit">{isLoading || isCreating || isPagePostLoading ? <Loading withText={true} />:t('post')}</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}


export type Author = 'user' | 'page'
export type Holder = 'user' | 'group' | 'page'

type PostModel = {
    authorType: Author,
    holderType: Holder,
    location: string | null
    withLocation: boolean
    page: TGetOneMiniPage | undefined
    showModel: boolean,
    groupId: string | null
    pageId: string | null
    setShowModel: (newValue: boolean, authorType?: Author, holderType?: Holder, page?: TGetOneMiniPage, groupId?: string,pageId?: string) => void
    setLocation: (location: string) => void
    setWithLocation: (withLocation: boolean) => void
}

export const usePostModel = create<PostModel>((set) => ({
    showModel: false,
    authorType: 'user',
    holderType: 'user',
    groupId: null,
    pageId:null,
    page: undefined,
    location: null,
    withLocation: false,
    setShowModel(showModel, authorType, holderType, page, groupId,pageId) {
        set((state) => ({ ...state, showModel, authorType: authorType ? authorType : state.authorType, holderType: holderType ? holderType : state.holderType, page, groupId,pageId }))
    },
    setLocation(location) {
        set({ location })
    },
    setWithLocation(withLocation) {
        set({ withLocation })
    },
}))
