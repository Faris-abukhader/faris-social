import Link from 'next/link'
import IllustrationContainer from '../general/IllustrationContainer'
import { Button } from '../ui/button'
import { HomeIcon } from 'lucide-react'
import { useTranslation } from 'next-i18next';
import StoresHelper from '../general/StoresHelper';

export default function NotFound() {
    const { t } = useTranslation()
    return (
        <div className="w-full h-[80vh] flex items-center justify-center">
            <StoresHelper session={undefined} isMobile={undefined} language={undefined}/>
            <div className=" relative">
                <IllustrationContainer description={t('404')} width={400} height={400} path="/illustrations/404.svg" />
                <Link href={`/`}>
                <Button size={'sm'} className="absolute capitalize mt-2 gap-x-1 left-1/2 -translate-x-1/2">
                    <HomeIcon className="w-4 h-4" />
                    <span>{t('goToHomePage')}</span>
                </Button>
                </Link>
            </div>
        </div>
    )
}