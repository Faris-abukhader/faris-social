import {  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from '@faris/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import  { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import ProfileDropdownSkeleton from '@faris/components/skeleton/ProfileDropdownSekeleton'
import { Button } from '@faris/components/ui/button'

const ProfileDropdown = () => {
    const { t } = useTranslation()
    const {user,isReady,signOut} = useSessionStore(state=>state)
    const { mutate } = api.auth.signOut.useMutation({
        onSuccess() {
            // when we successfully delete the session redirect to sign in page
            window.location.href = '/auth/sign-in'
            // clear zustand store 
            signOut()
        },
    })

    if(!isReady)return <ProfileDropdownSkeleton/>

    return (
       <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {user ? <Button variant={'outline'}  className='p-0 h-fit md:p-2 shadow-sm w-fit border rounded-full md:w-40 hover:cursor-pointer md:rounded-md flex items-center justify-start  gap-x-2'>
                    <Image src={user?.image??''} width={24} height={24} className='rounded-full w-6 h-6' alt='profile' />
                    <h1 className='text-xs hidden md:block line-clamp-2'>{user.fullName ? user.fullName:''}</h1>
                </Button> : <ProfileDropdownSkeleton />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={`/profile/${user.id}`}>
                    <DropdownMenuItem className='gap-x-2'>
                        <User className=" h-4 w-4" />
                        <span>{t('profile')}</span>
                    </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        <Link className='flex gap-x-2' href={`/settings`}>
                            <Settings className=" h-4 w-4" />
                            <span>{t('settings')}</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='gap-x-2' onClick={()=>void mutate()}>
                    <LogOut className="h-4 w-4" />
                    <span>{t('signOut')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(ProfileDropdown)