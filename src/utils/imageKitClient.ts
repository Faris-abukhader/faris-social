import { env } from "@faris/env.mjs";
import ImageKit from "imagekit-javascript";

export const imagekitClient = new ImageKit({
    publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});    