import Image from 'next/image';
import { type ImageType } from './SecondStep';
import Loading from '../general/Loading';
import useImageUploader from '@faris/hooks/useImageUploader';
import { STORAGE_FOLDER } from '@faris/server/module/common/common.schema';

// todo 
// for update usage, you can passing the initial image value to the custom hook
export default function CoverUploader({setCoverImage,imageHeight='h-40'}:{coverImage:string,setCoverImage:(newImage:ImageType)=>void,storageFolder?:string,imageHeight?:string}) {

  const {isLoading,image,handleImageUpload} = useImageUploader({folderName:STORAGE_FOLDER.COVER,onSuccess(newImage) {
      setCoverImage(newImage)
  },})

  return (
    <div className="space-x-6 space-y-3">
    <div className="shrink-0 w-full h-48 bg-accent flex items-center justify-center rounded-md mb-3">
      {isLoading ? <Loading/>:<Image className={`${imageHeight} w-full h-full object-cover rounded-md`} src={image?image.url:`/image/placeholder.png`} width={160} height={64} alt="Current profile photo" />}
    </div>
    <label className='w-full '>
      <span className="sr-only mx-auto">Choose cover photo</span>
      <input  type="file" onChange={(e)=>void handleImageUpload(e)} className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100
        text-opacity-0
      "/>
    </label>
  </div>
  )
}
