import {string,number,date,object,type Output} from 'valibot'

export const getTodayFriendsBirthdaySchema = object({
    currentDate:date(),
    userId:string()
})

export const getTargetMonthFriendsBirthdaySchema = object({
    currentMonth:number(),
    userId:string()
})

export const getUpcomingFriendsBirthdaySchema = object({
    currentDate:number(),
    currentMonth:number(),
    userId:string()
})

export type GetTodayFriendsBirthday = Output<typeof getTodayFriendsBirthdaySchema>
export type GetTargetMonthFriendsBirthday = Output<typeof getTargetMonthFriendsBirthdaySchema>
export type GetUpcomingFriendsBirthday = Output<typeof getUpcomingFriendsBirthdaySchema>