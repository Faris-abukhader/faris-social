import { Label } from '../ui/label'
import { useTranslation } from 'next-i18next';import { UploadCloudIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { useFormContext, useController } from 'react-hook-form'
import Loading from '../general/Loading'
import { api } from '@faris/utils/api'
import useImageUploader from '@faris/hooks/useImageUploader'
import { STORAGE_FOLDER } from '@faris/server/module/common/common.schema'

type Image = {
    url: string,
    path: string
}

type FormValues = {
    image: Image
}

export default function ImageUploader() {
    const { t } = useTranslation()

    const {control,} = useFormContext<FormValues>();

    const { field } = useController({
        control,
        name: "image"
    });

    const { setValue } = useFormContext()

    const {isLoading,handleImageUpload} = useImageUploader({folderName:STORAGE_FOLDER.POST,onSuccess(newImage) {
        setValue('image', newImage)
    },})

    const {mutate:deleteImage} = api.image.delete.useMutation()

    const removeOneImage = ()=> {
        deleteImage({id:field.value.path})
        setValue('image', null)
    }

    return (
        <div className=' space-y-2 w-full overflow-hidden'>
            {isLoading && <Loading />}
            {field && field.value && field.value.url ? <Card className='p-4'>
                <div className='group relative space-y-2 py-2'>
                    <Button onClick={removeOneImage} size={'sm'} variant={'ghost'} className='absolute top-3 right-3 hidden group-hover:block animate-in fade-in-50 rounded-full border-2 w-7 h-7 p-0'><X className='w-4 h-4 mx-auto' /></Button>
                    <Image src={field.value.url} width={800} height={500} alt={`image_`} />
                </div>
            </Card>
                :
                <section className={`flex items-center justify-center w-full`}>
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloudIcon className='w-8 h-8 text-gray-500 dark:text-gray-400' />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{t('clickToUpload')}</p>
                        </div>
                        <input onChange={(e) => void handleImageUpload(e)} id="dropzone-file" type="file" className="hidden" />
                    </Label>
                </section>
            }
        </div>
    )
}
