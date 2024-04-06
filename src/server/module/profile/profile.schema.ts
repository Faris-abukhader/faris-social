import { commonExpectedList, commonImageSchema, commonPaginationSchema } from '../common/common.schema'
import {string,boolean,length,object,type Output, minLength, maxLength, optional, nullable} from 'valibot'

export const getProfileRequestSchema = object({
    id:string()
})

export const getOneProfileFriendListRequestSchema = object({
    id:string(),
    ...commonPaginationSchema.object
})

export const updateProfileSchema = object({
    id:string(),
    bio:nullable(string([minLength(4),maxLength(250)])),
    livingLocation:nullable(string([minLength(1)])),
    fromLocation:nullable(string([minLength(1)])),
    status:nullable(string([minLength(1)])),
    fullName:string()
})

export const updateProfileImageSchema = object({
    id:string(),
    image:commonImageSchema
})

export const searchUserFriendQuerySchema = object({
    userId:string(),
    query:string(),
    execptedList:commonExpectedList,
    ...commonPaginationSchema.object
})


export const updateProfileAccountSettingSchema = object({
    id:string(),
    gender:string([length(1)]),
    livingLocation:optional(string()),
    contentLanguage:string([length(2)]),
    platformLanguage:string([length(2)]),
})

export const updateProfileSettingSchema = object({
    id:string(),
    isVisiable:boolean(),
    isPrivate:boolean(),
    bio:optional(string()),
    fullName:string(),
})

export const blockUserProcedureSchema = object({
    id:string(),
    targetUserId:string(),
    toBlock:boolean()
})

export const getOneUserBlockedListSchema = object({
    id:string(),
    ...commonPaginationSchema.object
})

export const setProfileOnlineSchema = object({
    profileId:string(),
    isOnline:boolean()
})

export const isUserBlockedSchema = object({
    profileId:string(),
    userId:string()
})

export type GetOneProfileFriendListRequest = Output<typeof getOneProfileFriendListRequestSchema>
export type UpdateProfile = Output<typeof updateProfileSchema>
export type UpdateProfileImage = Output<typeof updateProfileImageSchema>
export type SearchUserFriendQueryParams = Output<typeof searchUserFriendQuerySchema>
export type UpdateProfileAccountSettingParams = Output<typeof updateProfileAccountSettingSchema>
export type UpdateProfileSettingParams = Output<typeof updateProfileSettingSchema>
export type GetOneUserBlockedListParams = Output<typeof getOneUserBlockedListSchema>
export type BlockUserProcedureParams = Output<typeof blockUserProcedureSchema>
export type SetProfileOnlineParams = Output<typeof setProfileOnlineSchema>
export type IsUserBlockedParams = Output<typeof isUserBlockedSchema>
