import { Card } from '../ui/card'

export default function IntroSkeleton() {
    return (
        <Card className="w-full animate-pulse p-4  rounded-md shadow-md space-y-3">
            <div className="w-24 h-2 skeleton-background rounded-2xl mb-10"></div>
            <div className="w-1/4 h-2 skeleton-background rounded-2xl"></div>
            <div className="w-1/4 h-2 skeleton-background rounded-2xl"></div>
            <div className="w-1/3 h-2 skeleton-background rounded-2xl"></div>
            <div className="w-1/3 h-2 skeleton-background rounded-2xl"></div>
            <div className="w-1/5 h-2 skeleton-background rounded-2xl"></div>
            <ul className='pt-6 space-y-2'>
                {Array.from({ length: 4 }).map((v, i) => <div key={i} className='flex gap-x-3 items-center'>
                    <div className="w-4 h-4  skeleton-background rounded-full"></div>
                    <div className="w-20 h-2 skeleton-background rounded"></div>
                </div>)}
            </ul>
        </Card>
    )
}