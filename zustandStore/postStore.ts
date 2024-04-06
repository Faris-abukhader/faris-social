import { type TCreateNewComment } from '@faris/server/module/comment/comment.handler'
import type { GetOnePost as Post } from '@faris/server/module/post/post.handler'
import { type TCreateNewReply } from '@faris/server/module/reply/reply.handler'
import { create } from 'zustand'

type PostStore = {
    show:boolean,
    setShow:(show:boolean)=>void,
    currentCommentPageNumber:number
    setCurrentCommentPageNumber:(currentCommentPageNumber:number)=>void
    currentReplyPageNumber:number
    setCurrentReplyPageNumber:(currentCommentPageNumber:number)=>void
    totalCommentPage:number,
    setTotalCommentPage:(totalCommentPage:number)=>void
    post:Post|null,
    isExist:boolean,
    userLikeIt:boolean
    isSharedPost:boolean,
    setUserLikeIt:(userLikeIt:boolean)=>void
    setPost:(post:Post,isSharedPost:boolean)=>void
    addComment:(newComment:TCreateNewComment)=>void
    loadMoreComment:(commentList:TCreateNewComment[])=>void
    likePost:()=>void
    dislikePost:()=>void
    loadReply:(replyList:TCreateNewReply[],commentId:string)=>void  
    addReply:(reply:TCreateNewReply,commentId:string)=>void
    likeComment:(userId:string,commentId:string,totalLike:number)=>void
    dislikeComment:(commentId:string,totalLike:number)=>void
    likeReply:(userId:string,commentId:string,replyId:string,totalLike:number)=>void
    dislikeReply:(commentId:string,replyId:string,totalLike:number)=>void
}

const usePostStore = create<PostStore>((set) => ({
  show:false,
  post:null,
  isExist:false,
  isSharedPost:false,
  currentCommentPageNumber:0,
  currentReplyPageNumber:0,
  totalCommentPage:1,
  userLikeIt:false,
  setTotalCommentPage(totalCommentPage) {
    set({totalCommentPage})
  },
  setShow(show) {
    set({show})
  },
  setPost(post,isSharedPost) {
      set({post,isSharedPost,isExist:true,show:true,currentCommentPageNumber:0,currentReplyPageNumber:0,totalCommentPage:1,userLikeIt:post.likeList.length==1})
  },
  setCurrentCommentPageNumber(currentCommentPageNumber) {
    set({currentCommentPageNumber})
  },
  setUserLikeIt(userLikeIt) {
    set({userLikeIt})
  },
  addComment(newComment) {
    set((state)=>{
      if(state.post){
        return{post:{...state?.post,commentList:[newComment,...state.post?.commentList]}}
      }
      return state
    })
  },
  loadMoreComment(commentList) {
    set((state)=>{
      if(state.post){
        return{post:{...state?.post,commentList:[...commentList,...state.post?.commentList]}}
      }
      return state
    })
  },
  likePost() {
    set((state) => {
      if (state.post) {
        return {
          ...state,
          post: {
            ...state.post,
            _count: {
              ...state.post._count,
              likeList: state.post._count.likeList + 1,
            },
          },
        };
      }
      return state;
    });
  },
  dislikePost() {
    set((state) => {
      if (state.post && state.post._count.likeList > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            _count: {
              ...state.post._count,
              likeList: state.post._count.likeList - 1,
            },
          },
        };
      }
      return state;
    });
  },
  setCurrentReplyPageNumber(currentCommentPageNumber) {
    set({currentCommentPageNumber})
  },
  loadReply(replyList,id) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList:[
              ...state.post.commentList.map((comment)=>{
                if(comment.id==id){
                  return {
                    ...comment,
                    replyList:[...comment.replyList,...replyList]
                  }
                }
                return comment
              })
            ]
          },
        };
      }
      return state;
    });
  },
  addReply(newReply,commentId) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList:[
              ...state.post.commentList.map((comment)=>{
                if(comment.id==commentId){
                  return {
                    ...comment,
                    replyList:[...comment.replyList,newReply]
                  }
                }
                return comment
              })
            ]
          },
        };
      }
      return state;
    });
  },
  likeReply(userId,commentId, replyId,totalLike) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList: state.post.commentList.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replyList: comment.replyList.map((reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        likeList: [{id:userId}],
                        _count: {
                          ...reply._count,
                          likeList:totalLike
                        },
                      };
                    }
                    return reply;
                  }),
                };
              }
              return comment;
            }),
          },
        };
      }
      return state;
    });
  },
  dislikeReply(commentId,replyId,totalLike) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList: state.post.commentList.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replyList: comment.replyList.map((reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        likeList: [],
                        _count: {
                          ...reply._count,
                          likeList: totalLike,
                        },
                      };
                    }
                    return reply;
                  }),
                };
              }
              return comment;
            }),
          },
        };
      }
      return state;
    });
  },
  likeComment(userId, commentId,totalLike) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList: state.post.commentList.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  LikeList:[...comment.LikeList,{id:userId}],
                  _count:{
                    ...comment._count,
                    LikeList:totalLike
                  }
                };
              }
              return comment;
            }),
          },
        };
      }
      return state;
    });
  },
  dislikeComment(commentId,totalLike) {
    set((state) => {
      if (state.post && state.post.commentList.length > 0) {
        return {
          ...state,
          post: {
            ...state.post,
            commentList: state.post.commentList.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  LikeList:[],
                  _count:{
                    ...comment._count,
                    LikeList:totalLike
                  }
                };
              }
              return comment;
            }),
          },
        };
      }
      return state;
    });
  },
}))

export default usePostStore;