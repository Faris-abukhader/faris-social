import  { type ChangeEvent, useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { type UpdateProfileImage } from '@faris/server/module/profile/profile.schema'
import { v4 } from 'uuid'
import { useTranslation } from 'next-i18next';import Loading from './Loading'
import { Label } from '../ui/label'
import { imagekitClient } from '@faris/utils/imageKitClient'
import compressImageToWebP, { blobUrlToFile } from '@faris/utils/imageCompression'
import { authenticator } from '@faris/utils/imageKitAuthenticator'
import { STORAGE_FOLDER } from '@faris/server/module/common/common.schema'
import { api } from '@faris/utils/api'

interface ImageProfileProps {
    id:string
    image: {
        url: string,
        path: string
    } | null
    isOwner: boolean
    mutate:(image:UpdateProfileImage)=>void
}

// todo
// use custom hook here
export default function ImageProfile({ id, image, isOwner,mutate }: ImageProfileProps) {
    const {t} = useTranslation()
    const [showLoading, setShowLoading] = useState(false)
    const [showBar, setShowBar] = useState(false)
    const [newImage, setNewImage] = useState<string | null>(null)
    const [tempFile, setTempFile] = useState<File | null>()
    const {mutate:deleteImage} = api.image.delete.useMutation()

    const cancelChangeCover = ()=>{
        setShowBar(false)
        setNewImage(null)
    }


    const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files?.[0];

        if (!imageFile) return

        const imageUrl = URL.createObjectURL(imageFile);
        setNewImage(imageUrl)
        setTempFile(imageFile)
        setShowBar(true)

    }

    const confirmUploadImage = async () => {

        if (!tempFile) return

        setShowLoading(true)

        const compressedImage = await compressImageToWebP(tempFile);
    
        if (!compressedImage) return;
    
        const fileName = v4();
    
        const webpFile = await blobUrlToFile(compressedImage, fileName);
    
        if (!webpFile) return;


        // get the auth requirement to upload to imageKit
        const auth = await authenticator()
        
        // upload the new coverImage Into imageKit
        imagekitClient.upload({
            file:webpFile,
            folder:STORAGE_FOLDER.PROFILE,
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
            setShowLoading(false);
            setShowBar(false)
        });
     

        if (!image) return


        // delete the old cover image from imageKit
        deleteImage({id:image.path})
       
        // free out the memory
        setTempFile(null)
    }

    return (
        <>
        {showBar && <div className='fixed top-0 left-0 w-full h-screen bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-[100] px-4 sm:px-0'>
            <div className='w-full  absolute top-16 left-0 flex items-center justify-end bg-zinc-500 p-4 bg-opacity-40 gap-x-3 z-[99]'>
                <Button onClick={()=>void confirmUploadImage()}>{showLoading?<Loading withText={true}/>: t('confrim')}</Button>
                <Button variant={'outline'} onClick={cancelChangeCover}>{t('cancel')}</Button>
            </div>
            <Image src={newImage??''} width={400} height={400} alt='profile' className='mx-auto w-96 h-96 top-1/2 translate-y-1/2 rounded-full border-4 '/>
            {showLoading && <div className='fixed left-1/2 -translate-x-1/2 translate-y-1/2 top-1/2'><Loading/></div>}
            </div>}
        <div className='-mt-20 w-fit relative sm:-mt-14 ring-2- rounded-full '>
            <Image src={newImage ? newImage : (image?.url ?? '/icons/profile.svg')} width={120} height={120} alt='profile' className='rounded-full w-28 h-28 sm:w-32 sm:h-32 border-2 bg-accent  border-sky-600 dark:border-sky-800' />
            {isOwner && <Label htmlFor='image_file' className='inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors  border border-input bg-background hover:bg-accent hover:text-accent-foreground h-fit p-2 z-20 absolute bottom-2 right-2'>
            <input onChange={handleUploadImage} id='image_file' type='file' className='hidden' />
                <Camera className='w-4 h-4' />
            </Label> }
        </div>
        </>
    )
}
