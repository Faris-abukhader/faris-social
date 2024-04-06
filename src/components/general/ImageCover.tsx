import { Label } from '@faris/components/ui/label'
import { Camera } from 'lucide-react'
import  { type ChangeEvent, useState } from 'react'
import { Button } from '@faris/components/ui/button'
import Loading from './Loading'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';import { v4 } from 'uuid'
import { type UpdateProfileImage } from '@faris/server/module/profile/profile.schema'
import { api } from '@faris/utils/api'
import { imagekitClient } from '@faris/utils/imageKitClient'
import { STORAGE_FOLDER } from '@faris/server/module/common/common.schema'
import { authenticator } from '@faris/utils/imageKitAuthenticator'
import compressImageToWebP, { blobUrlToFile } from '@faris/utils/imageCompression'
import useLocalizationStore from 'zustandStore/localizationStore'

interface ImageCoverProps {
    id:string
    isOwner: boolean
    coverImage: {
        path: string,
        url: string
    }|null
    mutate:(image:UpdateProfileImage)=>void
}

// todo
// use custom hook here
export default function ImageCover({ id,isOwner, coverImage,mutate }: ImageCoverProps) {
    const { t } = useTranslation()
    const language = useLocalizationStore(state=>state.language)
    const [showCoverLoading, setShowCoverLoading] = useState(false)
    const [showBar, setShowBar] = useState(false)
    const [newCover, setNewCover] = useState<string | null>(null)
    const [tempFile, setTempFile] = useState<File | null>()

    const {mutate:deleteImage} = api.image.delete.useMutation({})

    const cancelChangeCover = ()=>{
        setShowBar(false)
        setNewCover(null)
    }


    const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files?.[0];

        if (!imageFile) return

        const imageUrl = URL.createObjectURL(imageFile);
        setNewCover(imageUrl)
        setTempFile(imageFile)
        setShowBar(true)
    }

    const confirmUploadImage = async () => {

        if (!tempFile) return

        setShowBar(false)
        setShowCoverLoading(true)

        
        // compress the image
        if (tempFile == undefined) return;
    
        const compressedImage = await compressImageToWebP(tempFile);
    
        if (!compressedImage) return;
    
        const fileName = v4();
    
        const webpFile = await blobUrlToFile(compressedImage, fileName);
    
        if (!webpFile) return;


        // get the auth requirement to upload to imageKit
        const auth = await authenticator()

        // upload to imageKit
        imagekitClient.upload({
            file:webpFile,
            folder:STORAGE_FOLDER.COVER,
            fileName:v4(),
            ...auth
        }).then((res) => {
            console.log(res);

            const newImage = {
              url: res.url,
              path: res.fileId,
              thumbnailUrl: res.thumbnailUrl,
            }

            // update the user info at database and the cache 
            mutate({ id, image:newImage})

          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setShowCoverLoading(false);
          });



        setShowBar(false)
        
        if (!coverImage) return

        // delete the old cover image from imageKit storage
        deleteImage({id:coverImage.path})

        // free out the memory
        setTempFile(null)
    }



    return (
        <div className='relative w-full h-560 sm:h-80 md:h-96 rounded-b-md shadow-inner'>
            {showCoverLoading && <div className='absolute w-full h-full bg-zinc-900 bg-opacity-60 flex items-center justify-center'>
                <Loading />
            </div>}
            {showBar && <div className='w-full absolute top-0 left-0 p-3 bg-zinc-800 bg-opacity-40 flex items-center justify-end gap-x-2 animate-in slide-in-from-top-3 fade-in-50 duration-500'>
                <Button size={'sm'} onClick={() => void confirmUploadImage()}>{showCoverLoading ?<Loading withText={true}/>:t('confirm')}</Button>
                <Button size={'sm'} variant={'outline'} onClick={cancelChangeCover}>{t('cancel')}</Button>
            </div>}
            <Image src={newCover ? newCover : (coverImage?.url ?? '/image/background.jpeg')} width={1200} height={700} priority={true} alt='cover_image' className='w-full h-560 sm:h-80 md:h-96 sm:rounded-b-md shadow-sm object-fill' />
            {isOwner && <Label htmlFor='cover_file' className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors  border border-input bg-background hover:bg-accent hover:text-accent-foreground h-fit p-2  sm:rounded-md z-20 absolute gap-x-2 bottom-2 ${language=='ar'?'left-2':'right-2'}`}>
                <div>
                    <input onChange={handleUploadImage} id='cover_file' type='file' className='hidden' />
                    <Camera className='w-4 h-4' />
                </div>
            </Label>}
        </div>
    )
}
