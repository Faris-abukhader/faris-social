import { type ReactNode } from 'react'
import { useTranslation } from 'next-i18next';import { Progress } from '../ui/progress'
import { Card } from '../ui/card'


export const Footer = ({children}:{
    children?:ReactNode
})=>{
    return(
        <div className='text-center'>
           {children}
        </div>
    )
}
export default function StepCard({ children,title,description,step }: {
    children?: ReactNode
    title: string
    description: string
    step: number
    onClick:()=>void

}) {
    const { t } = useTranslation()
    return (
        <div className='w-full p-4 sm:p-0 min-h-screen flex items-center justify-center'>
            <div className='w-full max-w-xl'>
                <div className='p-10'>
                    <h1 className='text-2xl font-bold py-2'>{t(title)}</h1>
                    <p className=' font-light text-sm'>{t(description)}</p>
                    <h1 className='mt-6 text-xs pb-2'>{t('step') + ` ${step} of 3`}</h1>
                    <Progress value={33.3 * step} className="w-full h-1 opacity-80" />
                </div>
                <Card className='w-full space-y-5 my-10 p-6 py-10'>
                    {children}
                </Card>
                <Footer/>
            </div>
        </div>
    )
}
