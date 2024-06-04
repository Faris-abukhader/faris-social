import { TRPCError } from "@trpc/server";
import { type SignUpType } from "./auth.schema";
import { prisma } from "@faris/server/db";
import { sign, verify } from 'jsonwebtoken'
import { sendVerifyEmail } from "@faris/server/verifyEmail";
import bcrypt from 'bcrypt'
import redis from "@faris/server/redis";
import { env } from "@faris/env.mjs";
import { type User } from "@faris/utils/session";
import { drizzle } from "@faris/server/drizzle";
import { user } from "drizzle/schema";
import { eq } from "drizzle-orm";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _globalSelectUserSession = {
    columns: {
        id: true,
        sessionId: true,
        email: true,
        password: true,
        gender: true,
        bio: true,
        contentLanguage: true,
        platformLanguage: true,
        livingLocation: true,
        fullName: true,
        username: true,
        isVisiable: true,
        isPrivate: true,
        isVerified: true,
        gettingStart: true,
        score: true,
        interestedTopics: true,
    },
    with: {
        image: {
            columns: {
                url: true,
                thumbnailUrl: true,
            }
        },
        coverImage: {
            columns: {
                url: true
            }
        }
    }
}


export const globalSelectUserSession = {
    id: true,
    sessionId: true,
    email: true,
    password: true,
    gender: true,
    bio: true,
    contentLanguage: true,
    platformLanguage: true,
    livingLocation: true,
    fullName: true,
    username: true,
    interestedTopics: true,
    isVisiable: true,
    isPrivate: true,
    image: {
        select: {
            url: true,
            thumbnailUrl:true
        }
    },
    isVerified: true,
    gettingStart: true,
    coverImage: {
        select: {
            url: true
        }
    },
    score: true
}


export const sessionObjectGenerator = (possibleUser: UserSessionAttributes) => {
    return {
        id: possibleUser.id,
        sessionId: possibleUser.sessionId,
        image: possibleUser.image?.url ?? null,
        thumbnailUrl:possibleUser.image?.thumbnailUrl ?? null,
        fullName: possibleUser.fullName,
        coverImage: possibleUser?.coverImage?.url ?? null,
        gettingStart: possibleUser.gettingStart,
        score: possibleUser.score,
        gender: possibleUser.gender,
        contentLanguage: possibleUser.contentLanguage,
        platformLanguage: possibleUser.platformLanguage,
        livingLocation: possibleUser.livingLocation,
        isVisiable: possibleUser.isVisiable,
        isPrivate: possibleUser.isPrivate,
        bio: possibleUser.bio,
        interestedTopics: possibleUser.interestedTopics,
    }
}

export type UserSession = ReturnType<typeof sessionObjectGenerator>

export const updateSessionHandler = async (user: UserSessionAttributes) => {
    const sessionObject = sessionObjectGenerator(user)

    // save session object into the cache
    try {
        await redis.set(user.sessionId, JSON.stringify(sessionObject))
    } catch (err) {
        console.log(err)
    }

}
export const signInHandler = async (body: SignUpType) => {

    const { email, password } = body

    // check if the user is exist
    // const possibleUser = await drizzle.query.user.findFirst({
    //     where: eq(user.email, email.toLowerCase()),
    //     columns: {
    //         id: true,
    //         sessionId: true,
    //         email: true,
    //         password: true,
    //         gender: true,
    //         bio: true,
    //         contentLanguage: true,
    //         platformLanguage: true,
    //         livingLocation: true,
    //         fullName: true,
    //         username: true,
    //         isVisiable: true,
    //         isPrivate: true,
    //         isVerified: true,
    //         gettingStart: true,
    //         score: true,
    //         interestedTopics: true,
    //     },
    //     with: {
    //         image: {
    //             columns: {
    //                 url: true,
    //             }
    //         },
    //         coverImage: {
    //             columns: {
    //                 url: true
    //             }
    //         }
    //     }
    // }).catch((err) => {
    //     console.log(err)
    //     throw new TRPCError({ code: 'NOT_FOUND' })
    // })

    // check if the user is exist
    const possibleUser = await prisma.user.findFirstOrThrow({
        where: {
            email: email.toLowerCase(),
        },
        select: globalSelectUserSession
    }).catch(() => {
        throw new TRPCError({ code: 'NOT_FOUND' })
    })

    // check if the user is in our db
    if (possibleUser == null || possibleUser == undefined) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }

    // if the user is not verified
    if (possibleUser.isVerified == false) throw new TRPCError({ code: 'FORBIDDEN' })

    // compare the password provided by the user and the one stored in db 
    const isPasswordsMatched = bcrypt.compareSync(password, possibleUser.password);

    // if the password is not correct throw an error
    if (!isPasswordsMatched) throw new TRPCError({ code: 'UNAUTHORIZED' })

    console.log(possibleUser)

    // generate session object
    const sessionObject = sessionObjectGenerator(possibleUser)

    // save session object into the cache
    try {
        await redis.set(possibleUser.sessionId, JSON.stringify(sessionObject))
    } catch (err) {
        console.log(err)
    }

    // return sessionID to user
    return { sessionId: possibleUser.sessionId }

}


export const signUpHandler = async (body: SignUpType) => {

    const { email, password } = body

    const possibleUser = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase()
        },
        select: {
            email: true
        }
    })

    // check if the user is already exist
    // const possibleUser = await drizzle.query.user.findFirst({
    //     where: eq(user.email, email.toLowerCase()),
    //     columns: {
    //         email: true
    //     }
    // })

    if (!!possibleUser && possibleUser != undefined && possibleUser.email) {
        throw new TRPCError({ code: 'FORBIDDEN' })
    }

    // create verify token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const verifyToken = sign({ email }, env.JWT_SECRET, { expiresIn: "24h" })

    // encrypt the password 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const hash = bcrypt.hashSync(password, 12);

    // create new user with email and token 
    await prisma.user.create({
        data: {
            email: email.toLocaleLowerCase(),
            password: hash,
        }
    })

    // create new user with email and token 
    // await drizzle.insert(user).values({
    //     email: email.toLocaleLowerCase(),
    //     password: hash
    // })

    // send email to user to verify 
    await sendVerifyEmail(email, verifyToken)

    // add token to redis
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await redis.set(`verifyToken.${email}`, verifyToken, { ex: 60 * 60 * 24 })

    return { code: 200, message: 'sucess' }

}

export const verifyHandler = async (token: string) => {
    try {

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const payload = verify(token, env.JWT_SECRET) as { email: string };

        if (payload && payload.email) {

            // await prisma.user.update({
            //     where: {
            //         email: payload.email,
            //     },
            //     data: {
            //         emailVerified: new Date(),
            //         isVerified: true,
            //     }
            // })

            await drizzle.update(user).set({
                emailVerified: new Date(),
                isVerified: true,
            }).where(eq(user.email, payload.email))

            // remove verify token from redis            
            await redis.del(`verifyToken.${payload.email}}`)

            return { code: 200, message: 'sucess' }
        }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const resendVerifyHandler = async (email: string) => {
    try {

        const token = sign({ email }, env.JWT_SECRET, { expiresIn: '24h' })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const isTokenInCache = await redis.get(`verifyToken.${email}`)

        if (isTokenInCache) {
            return { code: 400, status: 'verify token is already send to target email' }
        }

        // send email to user to verify 
        await sendVerifyEmail(email, token)

        // save token into cache
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await redis.set(`verifyToken.${email}`, token, { ex: 60 * 60 * 24 })

        return { code: 200, message: 'sucess' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const signOutHandler = async (user: User) => {

    // delete session object from cache 
    await redis.del(user.sessionId)

    // remove iron session from trpc route

    return { code: 200, message: 'success' }

}

// for generate type purpos only '_'
export const getUserSessionAttributesHandler = async (id: string) => {
    try {


        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: globalSelectUserSession
        })

        // const d = await drizzle.query.user.findFirst({
        //     ..._globalSelectUserSession
        // })


        // const targetUser = await drizzle.query.user.findFirst({
        //     where:eq(user.id,id),
        //     with:{
        //         image:true
        //         // coverImage:true,
        //         // profileImage:true
        //     }
        // })

        // if(!targetUser) throw new TRPCError({code:'NOT_FOUND'})


        return user

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export type UserSessionAttributes = Awaited<ReturnType<typeof getUserSessionAttributesHandler>>
