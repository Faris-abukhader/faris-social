import CryptoJS from "crypto-js"
import { env } from "@faris/env.mjs";

export const encrypt = (plainText:string)=>{
    return CryptoJS.AES.encrypt(plainText, env.CRYPTO_SECRET).toString();
}

export const decrypt = (hashValue:string)=>{
    const bytes  = CryptoJS.AES.decrypt(hashValue, env.CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}