import TodayBirthdays from './TodayBirthdays'
import UpcomingBirthdays from './UpcomingBirthdays'
import NextMonthBirthdays from './NextMonthBirthdays'

export default function BirthdayEvents() {
  return (
    <div className='w-full flex justify-center pt-10 pb-20'>
      <div className='w-full max-w-lg space-y-4'>
      <TodayBirthdays/>
      <UpcomingBirthdays/>
      <NextMonthBirthdays/>
      </div>
    </div>
  )
}
