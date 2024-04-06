import Image from "next/image";
import { type ImageType } from "./SecondStep";
import Loading from "../general/Loading";
import useImageUploader from "@faris/hooks/useImageUploader";
import { STORAGE_FOLDER } from "@faris/server/module/common/common.schema";

export default function ProfileUploader({
  setImage,
}: {
  setImage: (newImage: ImageType) => void;
}) {
  const { isLoading, image, handleImageUpload } = useImageUploader({
    folderName: STORAGE_FOLDER.PROFILE,
    onSuccess(newImage) {
      setImage(newImage);
    },
  });

  return (
    <div className="flex items-center gap-x-6">
      <div className="flex h-16 w-20 items-center justify-center rounded-full bg-accent">
        {isLoading ? (
          <Loading />
        ) : (
          <Image
            className="h-16 w-16 rounded-full object-cover"
            src={image ? image.url : `/icons/profile.svg`}
            width={64}
            height={64}
            alt="Current profile photo"
          />
        )}
      </div>

      <input
        id={`temp_image_input`}
        onChange={(e) => void handleImageUpload(e)}
        type="file"
        className="block w-full text-sm text-slate-500
        text-opacity-0 file:mr-4 file:rounded-full
        file:border-0 file:bg-violet-50
        file:px-4 file:py-2
        file:text-sm file:font-semibold
        file:text-violet-700
        hover:file:bg-violet-100"
      />
    </div>
  );
}
