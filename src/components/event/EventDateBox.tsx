
export default function EventDateBox({ className, date }: { className?: string, date: number }) {
    return (
        <div className={`rounded-md shadow-md w-14 h-14 bg-zinc-100 dark:bg-zinc-900 ${className ? className : ''}`}>
            <div className='w-full h-3 bg-orange-600 rounded-t-md'></div>
            <h1 className='absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 font-bold text-2xl'>{date - 1}</h1>
        </div>
    )
}
