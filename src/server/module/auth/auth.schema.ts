import {string,minLength,regex,email,nullable,object,type Output, enumType} from 'valibot'


// --------------- auth/[operation] page ----------- //
export const validOperation = ["sign-in", "sign-up"] as const;

export const querySchema = object({
  operation: enumType(validOperation),
});

export type Operation = typeof validOperation[number];
// --------------- auth/[operation] page ----------- //


export const sessionSchema = object({
    id:string(),
    email:string([email()]),
    username:string(),
    fullName:string(),
    image:nullable(string())
})

//Password must contain at least 8 characters, 
// including at least one uppercase letter,
// one lowercase letter, one digit, and one special character.
export const signSchema = object({
    email:string([email()]),
    password:string([minLength(8),regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)])
})

export const signInSchema = object({
    ...signSchema.object
})

export const signInResponseSchema = object({
    sessionId:string()
})

export const signUpSchema = object({
    ...signSchema.object
})

export const verifySchema = object({
    token:string()
})

export const resendVerifySchema = object({
    email:string()
})


export type SignInType = Output<typeof signInSchema>
export type SignUpType = Output<typeof signUpSchema>
export type VerifyType = Output<typeof verifySchema>

