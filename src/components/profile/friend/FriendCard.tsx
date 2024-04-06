import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { type TGetMiniUser } from '@faris/server/module/profile/profile.handler'

const FriendCard = ({ id, image, fullName }: TGetMiniUser) => {
    return (
        <div className='w-full'>
            <Link key={id} href={`/profile/${id}`} className='group relative'>
                <div className='absolute top-0 left-0 w-full h-full group-hover:bg-opacity-40 bg-black bg-opacity-0 transition-opacity ease-in-out duration-700'></div>
                <Image src={image?.url ?? '/icons/profile.svg'} width={300} height={300} className='rounded-md h-48' alt='profile_avatar' />
                <h1 className='group-hover:font-bold text-xs text-center pt-2'>{fullName}</h1>
            </Link>
        </div>
    )
}

export default memo(FriendCard)