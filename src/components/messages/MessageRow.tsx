import fromNow from '@faris/utils/fromNow'

export default function MessageRow({ isSender, message, createdAt }: { isSender: boolean, message: string, createdAt: Date }) {
    return (
        <div className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'} text-sm`}>
            <div className='w-fit  max-w-5/6'>
                <h1 className={`${isSender ? 'bg-green-500 rounded-br-sm' : 'bg-gray-500 rounded-bl-sm'} p-2 rounded-3xl`}>{message}</h1>
                <p className={`text-xs text-end`}>{fromNow(createdAt)}</p>
            </div>
        </div>
    )
}
