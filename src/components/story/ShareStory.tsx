import { AlertDialog, AlertDialogHeader, AlertDialogFooter, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@faris/components/ui/alert-dialog'
import { Button } from '@faris/components/ui/button'
import { api } from '@faris/utils/api'
import { useTranslation } from 'next-i18next';import { useStoryGallary } from 'zustandStore/storyGallaryStore'
import { useToast } from '../ui/use-toast'
import { Camera, Plus } from 'lucide-react'
import CoverUploader from '../gettingStart/CoverUploader'
import useSessionStore from 'zustandStore/userSessionStore'
import { type ImageType } from '../gettingStart/SecondStep'
import { useState } from 'react'

export default function ShareStory({type}:{type:'circle'|'square'}) {
    const {toast} = useToast()
    const {t} = useTranslation()
    const ownerId = useSessionStore(state=>state.user.id)
    const {addStory} = useStoryGallary(state=>state)
    const [img,setImg] = useState<ImageType>({path:'',url:'',thumbnailUrl:''})
    const {mutate,isLoading} = api.story.createNew.useMutation({
        onSuccess(data) {
            addStory(data.owner.id,data)
            toast({
                title:t('newStoryWasSharedSuccessfully')
            })
        },
    })

    const buttonRender = ()=>{
        if(type=='circle'){
            return <div className='group relative w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:cursor-pointer hover:border transition-all duration-300 ease-in-out border-blue-400'>
            <Camera className='w-4 h-4'/>
            <Plus className=' transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100 absolute bottom-0 right-0 w-3 h-3 bg-blue-400 text-white rounded-full border'/>
          </div>
        }
        return <Button className='w-full sm:w-fit gap-x-1'>
        <Plus className='w-3 h-3' />
        <span>{t('addToStory')}</span>
      </Button>
    }

  return (
    <AlertDialog>
            <AlertDialogTrigger asChild>
               {buttonRender()}
            </AlertDialogTrigger>
            <AlertDialogContent className='z-[200]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('createNewStory')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('createNewStoryDesc')}</AlertDialogDescription>
                </AlertDialogHeader >
                <CoverUploader coverImage={img.url} setCoverImage={(newImage)=>setImg(newImage)} imageHeight='h-80'/>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={() => mutate({ ownerId,account:'user',media:img })}>{t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
  )
}
