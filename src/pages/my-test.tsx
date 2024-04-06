import { api } from '@faris/utils/api'

export default function MyTest() {
    const { data: testData } = api.birthday.test.useQuery()

    return (
        <div className='w-full h-screen flex items-center justify-center text-gray-200'><pre className='max-w-lg'>{JSON.stringify(testData, null, 2)}</pre></div>
    )
}
