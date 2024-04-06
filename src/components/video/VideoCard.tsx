import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { MessageCircle, Share, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


const RightMenu = ({accountId}:{postId:string,accountId:string})=>{
    return(
        <div className='absolute right-0 sm:-right-16 bottom-2 w-14 grid grid-cols-1 justify-center space-y-6'>
            <Button variant={'ghost'} className='rounded-full p-0 w-12 h-12 bg-accent hover:border'><ThumbsUp className='w-4 h-4'/></Button>
            <Button variant={'ghost'} className='rounded-full p-0 w-12 h-12 bg-accent hover:border'><MessageCircle className='w-4 h-4'/></Button>
            <Button variant={'ghost'} className='rounded-full p-0 w-12 h-12 bg-accent hover:border'><Share className='w-4 h-4'/></Button>
            <Link href={`/profile/${accountId}`} className='mx-auto'>
                <Image src={'/image/elon-musk.jpeg'} className='rounded-md w-10 h-10 object-cover' width={40} height={40} alt='profile'/>
            </Link>
        </div>
    )
}
export default function VideoCard({index}:{index:number}) {

    const fakeData = {
        postId:"farflaernfaer",
        accountId:"farfakrfner"
    }
  return (
    <Card className='w-full rounded-none sm:rounded-md h-screen sm:max-w-[340px]  sm:max-h-[610px] mx-auto sm:-translate-x-2 relative'>
            <h1>{index}</h1>
    <RightMenu {...fakeData}/>
    </Card>
  )
}
