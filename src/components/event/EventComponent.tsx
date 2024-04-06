import EventHeader from './EventHeader'
import DetailsTab from './DetailWidget'
import EventGuestWidget from './EventGuestWidget'
import { type TGetOneEvent } from '@faris/server/module/event/event.handler'

export default function EventComponent({event}:{event:TGetOneEvent}) {
    return (
        <>
            <EventHeader event={event} />
            <div className="flex-row sm:flex shrink-0 space-y-3 sm:space-y-0 sm:gap-x-3 pb-20">
                <DetailsTab {...event}/>
                <EventGuestWidget {...event} />
            </div>
        </>
    )
}
