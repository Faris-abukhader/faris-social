import { prisma } from "@faris/server/db"
import { type SubmitGetingStartThirdStep, type SubmitGetingStartFirstStep, type SubmitGetingStartSecondStep } from "./gettingStart.schema"
import { TRPCError } from "@trpc/server"
import { globalSelectUserSession, updateSessionHandler } from "../auth/auth.handler"

export const submitFirstStepHandler = async (body: SubmitGetingStartFirstStep) => {

    try {

        const { id, birthday, ...rest } = body
        console.log(body)
        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                gettingStart: '2',
                birthday: {
                    create: {
                        year: birthday.getFullYear(),
                        month: birthday.getMonth() + 1,
                        day: birthday.getDate()
                    }
                },
                ...rest
            },
            select: globalSelectUserSession
        })

        await updateSessionHandler(targetUser)

        return targetUser

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const submitSecondStepHandler = async (body: SubmitGetingStartSecondStep) => {

    try {
        const { id, image, coverImage } = body

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                gettingStart: '3',
                image: {
                    create: {
                        ...image
                    }
                },
                coverImage: {
                    create: {
                        ...coverImage
                    }
                }
            },
            select: globalSelectUserSession
        })

        await updateSessionHandler(targetUser)

        return targetUser

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const submitThirdStepHandler = async (body: SubmitGetingStartThirdStep) => {

    try {
        const { id, interestedTopics } = body

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                gettingStart: 'c',
                interestedTopics
            },
            select: globalSelectUserSession
        })

        await updateSessionHandler(targetUser)

        return targetUser

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}