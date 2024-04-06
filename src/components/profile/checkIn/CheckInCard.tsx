import Image from 'next/image'
import { memo } from 'react'
interface CheckInCardProps {
    location: string,
    createdAt: Date
}
const CheckInCard = ({ location, createdAt }: CheckInCardProps)=> {
    return (
        <div className='border rounded-md flex items-center gap-x-3 shadow-sm'>
            <Image src={'/icons/location.png'} width={100} height={100} alt='profile_image' className='rounded-l-sm' />
            <div className='grid grid-cols-1 font-light text-xs'>
                <span >{location}</span>
                <span >{createdAt.toUTCString()}</span>
            </div>
        </div>
    )
}

export default memo(CheckInCard)