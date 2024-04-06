import { type ChangeEvent, useState } from "react";
import compressImageToWebP, {
  blobUrlToFile,
} from "@faris/utils/imageCompression";
import { v4 } from "uuid";
import { imagekitClient } from "@faris/utils/imageKitClient";
import { authenticator } from "@faris/utils/imageKitAuthenticator";

export type Image = {
  url: string;
  path: string;
  thumbnailUrl: string;
};

export default function useImageUploader({
  folderName,
  initialImage,
  onSuccess
}: {
  folderName: string;
  initialImage?:Image
  onSuccess?:(newImage:Image)=>void
}) {
  const [image, setImage] = useState<Image | null>(initialImage??null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("hello from handleImageUpload");
    if (!e || !e.target || !e.target.files || e.target.files.length == 0)
      return;

    setIsLoading(true);

    const file = e.target.files[0];

    if (file == undefined) return;

    const compressedImage = await compressImageToWebP(file);

    if (!compressedImage) return;

    const fileName = v4();

    const webpFile = await blobUrlToFile(compressedImage, fileName);

    if (!webpFile) return;

    const auth = await authenticator();

    return await imagekitClient
      .upload({
        folder: folderName,
        file: compressedImage,
        fileName,
        ...auth,
      })
      .then((res) => {
        console.log(res);
        const newImage = {
          url: res.url,
          path: res.fileId,
          thumbnailUrl: res.thumbnailUrl,
        }
        setImage(newImage);
        onSuccess && onSuccess(newImage)
      })
      .catch((err) => {
        console.log(err);
        setError(String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { isLoading, handleImageUpload, image, error };
}
