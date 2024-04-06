import { commonExpectedList, commonImageSchema, commonInvitationSchema, commonPaginationSchema } from '../common/common.schema';
import {string,boolean,optional,object,type Output, enumType, nullish, number} from 'valibot'
import { postCore } from '../post/post.schema';

// -------------- groups/[category]------------ //

export const pagesViews = ["feed", "your-groups", "discover","invitations",'joined-groups'] as const;

export const querySchema = object({
  category: enumType(pagesViews),
});

export type Category = typeof pagesViews[number];
// -------------- groups/[category]------------ //

export const groupCore = {
    title:string(),
    rules:string(),
    location:nullish(string()),
    category:string(),
    about:string(),
    isPrivate:optional(boolean(),false),
    isVisiable:optional(boolean(),false)
}

export const getOneGroupSchema = object({
    groupId:string(),
    requesterId:optional(string())
})

export const getOneGroupPostListSchema = object({
    groupId:string(),
    requesterId:string(),
    ...commonPaginationSchema.object
})


export const createNewGroupSchema = object({
    ...groupCore,
    ownerId:string(),
    coverImage:commonImageSchema,
    profileImage:commonImageSchema
})


export const updateOneGroupSchema = object({
    ...groupCore,
    id:string(),
    coverImage:commonImageSchema,
    profileImage:commonImageSchema
})

export const updateGroupIntroSchema = object({
    ...groupCore,
    id:string(),  
})

export const deleteOneGroupSchema = object({
    ownerId:string(),
    groupId:string(),
})

export const getOneUserGroupsListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export const getOneUserRecommendedGroupListSchema = getOneUserGroupsListSchema

export const getOneUserGroupInvitationListSchema = getOneUserGroupsListSchema

export const getOneUserJoinedGroupsSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export const inviteUsersToGroupSchema = object({
    groupId:string(),
    ...commonInvitationSchema.object
})

export const changeGroupCoverSchema = object({
    id:string(),
    image:commonImageSchema,
})

export const changeGroupProfileSchema = object({
    id:string(),
    image:commonImageSchema
})

export const getOneGroupFollowerListSchema = object({
    id:string(),
    ...commonPaginationSchema.object
})


export const userGroupProcedureSchema = object({
    wannaJoin:boolean(),
    userId:string(),
    groupId:string(),
    invitationId:nullish(string())
})

export const getOneUserGroupsPostListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export const muteGroupProcedureSchema = object({
    id:string(),
    targetGroup:string(),
    toMute:boolean()
})

export const getOneUserMutedListSchema = getOneUserGroupsPostListSchema

export const searchUserJoinedGroupSchema = object({
    userId:string(),
    title:string(),
    execptedList:commonExpectedList
})

export const votingSchema = object({
    userId:string(),
    groupId:string(),
    postId:string(),
    voting:enumType(["up","down"])
})

export const createNewGroupPostSchema = object({
    authorId:string(),
    groupId:string(),
    ...postCore,
})

export const sendRequestToJoinGroupSchema = object({
    groupId:string(),
    applierId:string()
})

export const requestToJoinGroupProcedureSchema = object({
    requestId:number(),
    ownerId:string(),
    requesterId:string(),
    groupId:string(),
    isAccepted:boolean()
})

export const getOneGroupJoinRequestListSchema = object({
    groupId:string(),
    ...commonPaginationSchema.object
})

export type CreateNewGroup = Output<typeof createNewGroupSchema>
export type UpdateOneGroup = Output<typeof updateOneGroupSchema>
export type UpdateGroupIntroParams = Output<typeof updateGroupIntroSchema>
export type DeleteOneGroup = Output<typeof deleteOneGroupSchema>
export type GetOneUserGroupsList = Output<typeof getOneUserGroupsListSchema>
export type GetOneUserRecommendedGroupList = Output<typeof getOneUserRecommendedGroupListSchema>
export type GetOneUserGroupInvitationList = Output<typeof getOneUserGroupInvitationListSchema>
export type GetOneGroup = Output<typeof getOneGroupSchema>
export type GetOneUserJoinedGroupsParams = Output<typeof getOneUserJoinedGroupsSchema>
export type InviteUsersToGroupParams = Output<typeof inviteUsersToGroupSchema>
export type ChangeGroupCoverParams = Output<typeof changeGroupCoverSchema>
export type ChangeGroupProfileParams = Output<typeof changeGroupProfileSchema>
export type GetOneGroupPostListParams = Output<typeof getOneGroupPostListSchema>
export type GetOneGroupFollowerListParams = Output<typeof getOneGroupFollowerListSchema>
export type UserGroupProcedureParams = Output<typeof userGroupProcedureSchema>
export type GetOneUserGroupsPostListParams = Output<typeof getOneUserGroupsPostListSchema>
export type MuteGroupProcedureParams = Output<typeof muteGroupProcedureSchema>
export type GetOneUserMutedListParams = Output<typeof getOneUserMutedListSchema>
export type SearchUserJoinedGroupParams = Output<typeof searchUserJoinedGroupSchema>
export type VotingParams = Output<typeof votingSchema>
export type CreateNewGroupPostParams = Output<typeof createNewGroupPostSchema>
export type SendRequestToJoinGroupParams = Output<typeof sendRequestToJoinGroupSchema>
export type RequestToJoinGroupProcedureParams = Output<typeof requestToJoinGroupProcedureSchema>
export type GetOneGroupJoinRequestListParams = Output<typeof getOneGroupJoinRequestListSchema>
