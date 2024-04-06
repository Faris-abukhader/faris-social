const compressImageToWebP = (file: File, maxSizeInBytes = 1000000): Promise<string | null> => {
    return new Promise<string | null>((resolve) => {
      let quality = 0.6; // Starting quality value
  
      const compressAndResolve = async () => {
        const compressedDataURL = await compressImageWithQuality(file, quality);
  
        if (compressedDataURL) {
          const blob = await fetch(compressedDataURL).then((res) => res.blob());
  
          if (blob.size <= maxSizeInBytes) {
            // Convert Blob to base64 string
            const base64String = await toBase64(blob);
  
            // Image is below the specified limit
            resolve(base64String);
          } else {
            // Reduce quality and try again
            quality -= 0.1;
            await compressAndResolve();
          }
        } else {
          // If the loop completes and the image is still too large, resolve with null
          console.warn('Unable to compress image below the specified limit.');
          resolve(null);
        }
      };
  
      // Start the compression and resolution process
      void compressAndResolve();
    });
  };
  
  
  // Helper function to convert Blob to base64
  const toBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          // Check if the readyState is DONE, indicating that the operation is complete
          if (reader.result) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const base64String = reader.result.toString();
            resolve(base64String);
          } else {
            reject(new Error('Error converting Blob to base64.'));
          }
        }
      };
  
      reader.readAsDataURL(blob);
    });
  };
    
    const compressImageWithQuality = async (file: File, quality: number): Promise<string | null> => {
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
    
        reader.readAsDataURL(file);
    
        reader.onload = (event) => {
          const img = new Image();
    
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            if (ctx) {
              ctx.drawImage(img, 0, 0, img.width, img.height);
    
              // Convert the canvas content to a data URL with WebP format and specified quality
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const compressedDataURL = URL.createObjectURL(blob);
                    resolve(compressedDataURL);
                  } else {
                    resolve(null);
                  }
                },
                'image/webp',
                quality
              );
            }
          };
    
          if (event.target) {
            img.src = event.target.result as string;
          }
        };
      });
    };
    
  
    export async function blobUrlToFile(blobUrl: string, fileName: string): Promise<File | null> {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName);
      } catch (error) {
        console.error('Error converting Blob URL to File:', error);
        return null;
      }
    }
  
    export function base64StringToFile(base64String: string, fileName: string, fileType = 'image/webp'): File {
      // const byteCharacters = atob(base64String);
      const standardBase64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
      const byteCharacters = atob(standardBase64String);
  
    
      const byteArrays = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      const blob = new Blob(byteArrays, { type: fileType });
      return new   File([blob], fileName, { type: fileType });
    }
    export default compressImageToWebP