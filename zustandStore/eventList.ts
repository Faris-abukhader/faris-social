import {create} from 'zustand'
import { type GetOneEvent } from '@faris/server/module/event/event.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

export type EventTarget = 'goingList'|'interestedList'|'discover'|'yourEvent'|string

type EventStore = {
    target:EventTarget,
    isLoading:boolean
    setIsLoading:(isLoading:boolean)=>void
    eventList:GetOneEvent[]|[]
    setEvents:(data:GetOneEvent[]|[],page:number,target:string)=>void
    updateEvent:(eventId:string,updatedData:GetOneEvent)=>void
    deleteEvent:(eventId:string)=>void
    createEvent:(newEvent:GetOneEvent)=>void
    loadEvents:(newEventList:GetOneEvent[],page:number,target:string)=>void
    range:number,
    pages:number,
    currentPage:number,
    nextPage:()=>void,
}
export const useEventListStore = create<EventStore>((set,get)=>({
    target:'yourEvent',
    isLoading:false,
    eventList:[],
    setEvents:(data,pages,target)=>{
        console.log({target})
        set({eventList:data??[],pages,target,currentPage:0})
    },
    setIsLoading(isLoading) {
        set({isLoading})
    },
    updateEvent: (eventId, updatedData) => {
        set((state) => ({
            eventList: state.eventList.map((event) =>
            event.id === eventId ? { ...event, ...updatedData } : event
          ),
        }));
      },
      deleteEvent: (eventId) => {
        set((state) => ({
            eventList: state.eventList.filter(event => event.id != eventId),
        }));
      },
      createEvent(newEvent) {
          set(state=>({eventList:[newEvent,...state.eventList]}))
      },
      loadEvents(newEventList,pages,target) {
        console.log({target})
          set((state)=>({eventList:[...state.eventList??[],...newEventList??[]],pages,target}))
      },
      pages:0,
      range:PAGINATION.EVENTS,
      currentPage:0,
      nextPage() {
        set(state => ({ ...state, currentPage: state.currentPage < state.pages ? state.currentPage + 1 : state.currentPage }))
      },
  
}))