import React from 'react'
import { AvatarFallback,Avatar,AvatarImage } from '../ui/avatar'

interface CustomAvatarProps {
    className?:string
    imageUrl?:string
    alt:string
    onClick?:()=>void
}
export default function CustomAvatar({className,imageUrl,alt,onClick}:CustomAvatarProps) {
  const handleOneClick = ()=>{
    if(onClick){
      onClick()
    }
  }
  return (
    <Avatar className={className} onClick={handleOneClick}>
    <AvatarImage src={imageUrl}  alt={alt} />
    <AvatarFallback>{alt.slice(0, 2).toUpperCase()}</AvatarFallback>
  </Avatar>
  )
}
