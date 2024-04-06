import { create } from 'zustand'
import { type TCreateNewComment } from '@faris/server/module/comment/comment.handler'
import { type TGetOneGroupPost, type TGetOneGroupWithPosts } from '@faris/server/module/group/group.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

export type Status = 'joined' | 'unjoined' | 'pending'

type PostStore = {
    isLoading: boolean
    groupId: string
    range: number,
    totalPages: number,
    currentPage: number,
    nextPage: () => void,
    setGroupId: (newGroupId: string) => void
    postList: TGetOneGroupPost[] | []
    groupPost: TGetOneGroupWithPosts[] | []
    setData: (groupPost: TGetOneGroupPost[] | [], totalPages: number,status:Status) => void
    loadData: (groupPost: TGetOneGroupPost[] | [], totalPages: number,status:Status) => void
    setIsLoading: (isLoading: boolean) => void
    updatePost: (postId: string, updatedData: TGetOneGroupPost) => void
    deletePost: (postId: string) => void
    addPost: (newPost: TGetOneGroupPost) => void
    addComment: (newComment: TCreateNewComment, postId: string) => void
    status:Status,
    votingProcedure:(postId:string,userId:string,isUp:boolean)=>void
    setStatus:(status:Status)=>void
}
export const useGroupPostListStore = create<PostStore>((set, get) => ({
    isLoading: false,
    range: PAGINATION.POSTS,
    status:'unjoined',
    totalPages: 0,
    currentPage: 0,
    groupPost: [],
    nextPage() {
        get().currentPage < get().totalPages && set((state) => ({ currentPage: state.currentPage + 1 }))
    },
    setGroupId(newGroupId) {
        set({ groupId: newGroupId })
    },
    groupId: '',
    postList: [],
    setData: (data, totalPages,status) => {
        set((state) => ({ ...state, postList: data, totalPages,status }))
    },
    loadData(newPostList, totalPages,status) {
        set((state) => ({ ...state, postList: [...state.postList, ...newPostList], totalPages,status }))
    },
    setIsLoading(isLoading) {
        set({ isLoading })
    },
    updatePost: (postId, updatedData) => {
        set((state) => ({
            postList: state.postList.map((post) =>
                post.id === postId ? { ...post, ...updatedData } : post
            ),
        }));
    },
    deletePost: (postId) => {
        set((state) => ({
            postList: state.postList.filter((post) => post.id !== postId),
        }));
    },
    addPost(newPost) {
        set(state => ({ postList: [newPost, ...state.postList] }))
    },
    addComment(newComment, postId) {
        set(state => ({ postList: state.postList.map(post => post.id == postId ? { ...post, commentList: [newComment, ...post.commentList] } : post) }))
    },
    votingProcedure(postId, userId, isUp) {
        set(state=>({postList:state.postList.map(post=>{
            if(post.id == postId){
                if(isUp){
                    post.votingDown = []
                    post.votingUp = [{id:userId}]
                }else{
                    post.votingDown = [{id:userId}]
                    post.votingUp = []
                }
            }
            return post
        })}))
    },
    setStatus(status) {
        set({status})
    },
}))