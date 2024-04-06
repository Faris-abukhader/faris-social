import {create} from 'zustand'

type Comment = { 
    authorId: string;
    postId: string;
}

type Reply = {
    authorId: string;
    commentId: string;
}
type CommentReplyProcedure = {
    action:string
    target:string
    content:string
    comment:Comment|null
    commentOwner:string|null
    setComment:(comment:Comment,action:string)=>void
    setContent:(content:string)=>void
    reply:Reply|null
    setReply:(Reply:Reply,action:string,commentOwner:string)=>void
    reset:()=>void
}

const useCommentReplyProcedureStore = create<CommentReplyProcedure>((set)=>({
    action:'create',
    target:'comment',
    comment:null,
    content:'',
    reply:null,
    commentOwner:null,
    setComment(comment,action) {
        set({comment,target:'comment',action})
    },
    setContent(content) {
        set({content})
    },
    setReply(reply,action,commentOwner) {
        set({reply,target:'Reply',action,commentOwner})
    },
    reset() {
        set({comment:null,reply:null,target:'comment',content:'',action:'create'})
    },
}))

export default useCommentReplyProcedureStore;