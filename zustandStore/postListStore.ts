import { create } from 'zustand'
import { type GetOneSharedPost, type GetOnePost } from '@faris/server/module/post/post.handler'
import { type TCreateNewComment } from '@faris/server/module/comment/comment.handler'
import { type TGetOneGroupWithPosts } from '@faris/server/module/group/group.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

interface Post extends GetOnePost {
    bookmarkId?: number
}

interface SharedPost extends GetOneSharedPost {
    bookmarkId?: number
}
type PostStore = {
    isLoading: boolean
    profileId: string
    range: number,
    totalPages: number,
    currentPage: number,
    nextPage: () => void,
    setProfileId: (newProfileId: string) => void
    postList: (Post | SharedPost)[] | []
    groupPost: TGetOneGroupWithPosts[] | []
    setGroupPost: (groupPost: TGetOneGroupWithPosts[] | [], totalPages: number,target:string, isJoinedGroup?: boolean) => void
    loadGroupPost: (groupPost: TGetOneGroupWithPosts[] | [], totalPages: number,target:string, isJoinedGroup?: boolean) => void
    setPosts: (data: (Post | SharedPost)[] | [], totalPages: number, isPageLiked?: boolean) => void
    loadPosts: (data: Post[], totalPages: number, isPageLiked?: boolean) => void
    setFeedPosts: (data: (Post | SharedPost)[] | [], totalPages: number, profileId: string) => void
    loadFeedPosts: (data: Post[], totalPages: number,profileId:string) => void
    setIsLoading: (isLoading: boolean) => void
    updatePost: (postId: string, updatedData: Post) => void
    deletePost: (postId: string) => void
    likePost: (postId: string, userId: string) => void
    dislikePost: (postId: string, userId: string) => void
    addPost: (newPost: Post) => void
    addComment: (newComment: TCreateNewComment, postId: string) => void
    isPageLiked: boolean
    setIsPageLiked: (isPageLiked: boolean) => void
    conversationId:number,
    setConversationId:(conversationId:number)=>void
}
export const usePostListStore = create<PostStore>((set, get) => ({
    isLoading: false,
    range:PAGINATION.POSTS,
    totalPages: 0,
    currentPage: 0,
    isPageLiked: false,
    groupPost: [],
    nextPage() {
        get().currentPage < get().totalPages && set((state) => ({ currentPage: state.currentPage + 1 }))
    },
    setProfileId(newProfileId) {
        set({ profileId: newProfileId })
    },
    profileId: 'none',
    postList: [],
    conversationId:-1,
    setPosts: (data, totalPages, isPageLiked) => {
        set((state) => ({ ...state, postList: data, totalPages, isPageLiked: isPageLiked ? isPageLiked : state.isPageLiked }))
    },
    loadPosts(newPostList, totalPages, isPageLiked) {
        set((state) => ({ ...state, postList: [...state.postList, ...newPostList], totalPages, isPageLiked: isPageLiked ? isPageLiked : state.isPageLiked }))
    },
    setIsLoading(isLoading) {
        set({ isLoading })
    },
    setFeedPosts(data, totalPages, profileId){
        set(({postList: data, totalPages,profileId}))
    },
    loadFeedPosts(data, totalPages, profileId) {
        set(state => ({ postList: [...state.postList, ...data], totalPages, profileId }))
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
    likePost(postId, userId) {
        set((state) => ({
            postList: state.postList.map(post => {
                if (post.id === postId) {
                    return { ...post, _count: { ...post._count, likeList: post._count.likeList + 1 }, likeList: [...post.likeList, { id: userId }] }
                }
                return post
            })
        }))
    },
    dislikePost(postId, userId) {
        set((state) => ({
            postList: state.postList.map(post => {
                if (post.id === postId) {
                    return { ...post, _count: { ...post._count, likeList: post._count.likeList - 1 }, likeList: [...post.likeList.filter((user) => user.id !== userId)] }
                }
                return post
            })
        }))
    },
    addPost(newPost) {
        set(state => ({ postList: [newPost, ...state.postList] }))
    },
    addComment(newComment, postId) {
        set(state => ({ postList: state.postList.map(post => post.id == postId ? { ...post, commentList: [newComment, ...post.commentList] } : post) }))
    },
    setIsPageLiked(isPageLiked) {
        set({ isPageLiked })
    },
    setGroupPost(groupPost, totalPages,target, isJoinedGroup) {
        set({ groupPost, totalPages, isPageLiked: isJoinedGroup,profileId:target })
    },
    loadGroupPost(groupPost, totalPages,target, isJoinedGroup) {
        set((state) => ({ ...state, groupPost: [...state.groupPost, ...groupPost], totalPages, isPageLiked: isJoinedGroup ? isJoinedGroup : state.isPageLiked,profileId:target }))
    },
    setConversationId(conversationId) {
        set({conversationId})
    },
}))