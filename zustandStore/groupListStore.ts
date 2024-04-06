import { create } from 'zustand'
import { type TGetOneGroup,type TGetOneGroupInvitation } from '@faris/server/module/group/group.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

type GroupStore = {
    target: string | null,
    type: 'group'|'invitation',
    groupList: TGetOneGroup[] | []
    invitationList : TGetOneGroupInvitation[] | []
    setGroups: (data: TGetOneGroup[] | [], group: number, target: string) => void
    setGroupInvitations: (data: TGetOneGroupInvitation[] | [], group: number, target: string) => void
    updateGroup: (groupId: string, updatedData: TGetOneGroup) => void
    deleteGroup: (groupId: string) => void
    createGroup: (newGroup: TGetOneGroup) => void
    loadGroups: (newGroupList: TGetOneGroup[], pages: number) => void
    loadInvitations: (newGroupInvitationList: TGetOneGroupInvitation[], pages: number) => void
    joinGroup: (groupId: string, userId: string) => void,
    disJoinGroup: (groupId: string) => void,
    range: number,
    pages: number,
    currentPage: number,
    nextPage: () => void,
    currentGroup:TGetOneGroup|null
    setCurrentGroup:(currentGroup:TGetOneGroup|null)=>void
}
export const useGroupListStore = create<GroupStore>((set) => ({
    target: null,
    type:'group',
    groupList: [],
    invitationList:[],
    setGroups: (data, pages, target) => {
        set({ groupList: data, pages, target,type:'group' })
    },
    setGroupInvitations(data, pages, target){
        set({invitationList:data,pages,target,type:'invitation'})
    },
    updateGroup: (groupId, updatedData) => {
        set((state) => ({
            groupList: state.groupList.map((group) =>
                group.id === groupId ? { ...group, ...updatedData } : group
            ),
        }));
    },
    deleteGroup: (groupId) => {
        set((state) => (state.type=='group' ? {
            groupList: state.groupList.filter((group) => group.id !== groupId),
        }:{
            invitationList:state.invitationList.filter(invitation=> invitation.id!==groupId)
        }));
    },
    createGroup(newGroup) {
        set(state => ({ groupList: [newGroup, ...state.groupList] }))
    },
    loadGroups(newGroupList, pages) {
        set((state) => ({ groupList: [...newGroupList, ...state.groupList], pages }))
    },
    loadInvitations(newGroupInvitationList, pages) {
        set((state) => ({ invitationList: [...newGroupInvitationList, ...state.invitationList], pages,target:'invitation' }))
    },
    pages: 0,
    range: PAGINATION.GROUPS,
    currentPage: 0,
    nextPage() {
        set(state=>({...state,currentPage:state.currentPage < state.pages ?state.currentPage+1:state.currentPage}))
    },
    joinGroup(groupId, userId) {
        set((state)=>({
            groupList:state.groupList.map(group=>{
                if(group.id===groupId){
                    return {...group,_count:{...group._count,groupMember:group._count.groupMember+1},groupMember:[{id:userId,fullName:'',bio:'',image:{url:'',thumbnailUrl:''},createdAt:new Date()}]}
                }
                return group
             })
        }))
    },
    disJoinGroup(groupId) {
        set((state)=>({
            groupList:state.groupList.map(group=>{
                if(group.id===groupId){
                    return {...group,_count:{...group._count,groupMember:group._count.groupMember-1},groupMember:[]}
                }
                return group
             })
        }))
    },
    currentGroup:null,
    setCurrentGroup(currentGroup) {
        set({currentGroup})
    },
}))