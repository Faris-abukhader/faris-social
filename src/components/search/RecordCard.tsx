import Link from 'next/link'
import CustomAvatar from '../general/CustomAvatar'
import { ChevronRight } from 'lucide-react'
import { type ReactNode } from 'react'

interface RecordCardProps {
    target:string,
    id:string,
    image:{
        url:string
    }|null
    children?:ReactNode
}
export default function RecordCard({children,id,target,image}:RecordCardProps) {
    return (
        <Link href={`/${target}/${id}`}>
            <div className='w-full relative group flex items-center gap-x-2 p-4 border-b hover:bg-popover'>
                <CustomAvatar imageUrl={image?.url} alt={`@${id}_profile_img`} />
                <div>
                    {children}
                </div>
                <ChevronRight className=' absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 duration-500 transition-opacity' />
            </div>
        </Link>
    )
}