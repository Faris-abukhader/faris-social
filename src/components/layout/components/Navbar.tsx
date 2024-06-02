import { Bell, Blinds, Home, Menu, Search, Users } from 'lucide-react'
import Link from 'next/link'
import ColorModeChanger from './ColorPicker'
import { Button } from '@faris/components/ui/button'
import ProfileDropdown from './ProfileDropdown'
import useMobileDetection from 'zustandStore/mobileDetection'
import useOffcanva from 'zustandStore/OffcanvaStore'
import { type FormEvent, useState, memo } from 'react'
import { useRouter } from 'next/router'
import { Card } from '@faris/components/ui/card'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import NavbarSkeleton from '../../skeleton/NavbarSkeleton'
import NotificationDropdown from './NotificationDropdown'

const Navbar = ({ showSearchingBar = true }: { showSearchingBar?: boolean }) => {
    const { t } = useTranslation()
    const isMobile = useMobileDetection(state => state.isMobile)
    const setOpen = useOffcanva(state => state.openFunc)
    const { push } = useRouter()
    const [query, setQuery] = useState('')
    const isReady = useSessionStore(state => state.isReady)


    const linkList = [
        {
            href: '/',
            Icon: <Home className='w-5 h-5' />
        },
        {
            href: '/for-you',
            Icon: <Blinds className='w-5 h-5' />
        },
        // this feature is not included so far
        // {
        //     href: '/video',
        //     Icon: <MonitorPlay className='w-5 h-5' />
        // },
        {
            href: '/groups/feed',
            Icon: <Users className='w-5 h-5' />
        },
    ]

    const searchHandler = (e: FormEvent) => {
        e.preventDefault()
        void push(`/search?query=${query}`)
    }

    if (!isReady) return <NavbarSkeleton />

    return (
        <Card className='w-full h-16 fixed top-0 left-0 flex items-center justify-between border-l-0 border-r-0 border-t-0 border-b rounded-none px-2 sm:px-5 py-2 z-50' >
            {/* logo */}
            <div className='w-fit flex items-center gap-x-5'>
                <Link href={`/`}>{t('platformName')}</Link>
                {showSearchingBar && <form onSubmit={searchHandler}>
                    <div className='hidden opacity-0 md:opacity-100 md:flex items-center px-2 gap-x-2 bg-white dark:bg-black rounded-md border bg-popover'>
                        <Search className='w-5 h-5' />
                        <label htmlFor='searching_query' className=' sr-only'>searching input</label>
                        <input id='searching_query' value={query} onChange={(e) => setQuery(e.target.value)} className='max-w-[100px] py-2 hidden sm:block border-none bg-transparent hover:outline-none focus:outline-none text-[16px]' />
                    </div>
                </form>}
            </div>
            <div className='hidden sm:flex items-center gap-x-7'>
                {linkList.map(({ href, Icon }) => <Link key={href} href={href} className='p-3 hover:bg-accent hover:text-accent-foreground rounded-full animate-in slide-in-from-top-3 duration-500 delay-300 fade-in-5'>
                    <>{Icon}</>
                    <label className=' sr-only'>{href} label for icon</label>
                    </Link>)}
            </div>
            <div className='flex items-center gap-x-2'>
                {isMobile ?
                    <Button variant={'ghost'} className='px-2' onClick={() => void push(`/notification`)}>
                        <Bell className='w-5 h-5' />
                        <span className="sr-only mx-auto">notification button</span>
                        </Button>
                    :
                    <NotificationDropdown />
                }
                <ColorModeChanger />
                <ProfileDropdown />
                <Button id='searching_button' className='rounded-full w-7 h-7' variant={'ghost'} size={'icon'}>
                    <Link href={`/search`}>
                    <Search className='w-4 h-4 md:hidden' />
                    <label className=' sr-only'>searching link</label>
                    </Link>
                    <label htmlFor='searching_button' className="sr-only mx-auto">searching button</label>
                </Button>
                <Button id='show_offcanva_button' className='sm:hidden' variant={'ghost'} onClick={setOpen}>
                <label htmlFor='show_offcanva_button' className="sr-only mx-auto">show_offcanva_button</label>
                    <Menu className='w-4 h-4' />
                </Button>
            </div>
            {/* phone screen */}
            {/* logo */}
        </Card>

    )
}

export default memo(Navbar)