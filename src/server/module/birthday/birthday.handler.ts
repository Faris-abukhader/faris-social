import { TRPCError } from "@trpc/server"
import { type GetUpcomingFriendsBirthday, type GetTargetMonthFriendsBirthday, type GetTodayFriendsBirthday } from "./birthday.schema"
import { prisma } from "@faris/server/db"
import { drizzle } from "@faris/server/drizzle"
import { birthday, friendship, image, user } from "drizzle/schema"
import { eq, or } from "drizzle-orm"
import { getCacheStrategy } from "../common/common.handler"

// const _globelSelectBirthday = {
//     id: user.id,
//     fullName: user.fullName,
//     image: image.url,
//     birthday: {
//         year: birthday.year,
//         month: birthday.month,
//         day: birthday.day
//     }
// }

const globelSelectBirthday = {
    id: true,
    fullName: true,
    image: {
        select: {
            url: true,
            thumbnailUrl: true,
        }
    },
    birthday: {
        select: {
            year: true,
            month: true,
            day: true,
        }
    },
}

// only used to get the return type 
// do not user this function
export const getOneUserBirthday = async () => {
    try {

        const targetUser = await prisma.user.findFirst({
            select: globelSelectBirthday
        })

        return targetUser
    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _globelSelectBirthday = {
    id: user.id,
    fullName: user.fullName,
    image: {
        url: image.url
    },
    birthday: {
        year: birthday.year,
        month: birthday.month,
        day: birthday.day
    }
}

/*
const globelSelectBirthday = {
id: true,
fullName: true,
image: {
select: {
    url: true,
}
},
birthday: {
select: {
    year: true,
    month: true,
    day: true,
}
},
}

*/

export const test = async () => {
    console.log("hello from test")
    // const currentDate = new Date()
    const id = 'clptkcroe0000ei0v77srzt8l'
    try {


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const friendIds = await drizzle
            .query.friendship.findMany({
                where: or(
                    eq(friendship.ownerId, id),
                    eq(friendship.friendId, id)
                ),
                columns: {
                    id: true
                }
            })

        // const users = await drizzle.query.user.findMany({
        //     where: inArray(user.id, friendIds.map(id => id.id))
        // })




        // const data = await drizzle.select(_globelSelectBirthday)
        //     .from(user)
        //     .leftJoin(image, eq(user.id, image.ownerId))
        //     .leftJoin(birthday, eq(user.id, birthday.userId))
        //     // .where(eq())
        //     .where(
        //         and(
        //             eq(user.id, 'clptkcroe0000ei0v77srzt8l'),
        //             eq(birthday.month, currentDate.getMonth() + 1),
        //             eq(birthday.day, currentDate.getDate())
        //         )
        //     )


        // console.log(JSON.stringify(data.at(0), null, 2))
        // return data
        /**
        WITH UserFriends AS (
            SELECT
                f.friendId AS friendUserId
            FROM
                "Friendship" f
            WHERE
                f.ownerId = :user_id
        )
        SELECT
            u.id AS friendUserId,
            u.fullName AS friendFullName,
            b.year,
            b.month,
            b.day
        FROM
            UserFriends uf
        JOIN
            "User" u ON uf.friendUserId = u.id
        JOIN
            "Birthday" b ON u.id = b.userId
        WHERE
            b.month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND b.day = EXTRACT(DAY FROM CURRENT_DATE);

         */

        // const query = drizzle.select({
        //     id: user.id,
        //     fullName: user.fullName,
        //     image: {
        //         url: image.url
        //     },
        //     birthday: {
        //         year: birthday.year,
        //         month: birthday.month,
        //         day: birthday.day
        //     }        
        // }).from(user)
        // .leftJoin(friendship,eq(friendship.ownerId,id))
        //   .where(and(
        //     eq(user.)
        //   ))
        // .leftJoin(friendship, eq(user.id, frie))
        // .leftJoin(birthday).on(user.id.eq(birthday.userId))
        // .where(
        //     friendship.ownerId.equals(userId)
        //         .and(birthday.month.equals(currentMonth))
        //         .and(birthday.day.equals(currentDay))
        // );

        // const result = await drizzle.execute(query);



        const users = await drizzle.query.user.findFirst({
            with: {
                friendList: {
                    // where: (users, { eq }) => eq(users..id, 1),
                    // where:and(
                    //     eq(birthday.month,currentDate.getMonth() + 1),
                    //     eq(birthday.day,currentDate.getDate()),
                    // ),
                    with: {
                        friend: {
                            with: {

                            }
                            // columns:{
                            //     id: user.id,
                            //     fullName: user.fullName,
                            //     image: {
                            //         url: image.url
                            //     },
                            //     birthday: {
                            //         year: birthday.year,
                            //         month: birthday.month,
                            //         day: birthday.day
                            //     }  
                            // }
                        }
                    }

                }
            },
            where: (user, { eq }) => eq(user.id, id),
        })


        // const data = await drizzle.query.user.findFirst({
        //     where: eq(user.id, id),
        //     with: {
        //         friendList: {
        //             where: and(
        //                 eq(birthday.month, currentDate.getMonth() + 1),
        //                 eq(birthday.day, currentDate.getDate())
        //             ),
        //             with: {
        //                 friend: {
        //                     columns: {
        //                         id: user.id,
        //                         fullName: user.fullName,
        //                     },
        //                     with: {
        //                         image: {
        //                             columns: {
        //                                 url: image.url
        //                             }
        //                         },
        //                         birthday: {
        //                             year: birthday.year,
        //                             month: birthday.month,
        //                             day: birthday.day
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         friendOf: {
        //             where: and(
        //                 eq(birthday.month, currentDate.getMonth() + 1),
        //                 eq(birthday.day, currentDate.getDate())
        //             ),
        //             with: {
        //                 owner: {
        //                     columns: {
        //                         id: user.id,
        //                         fullName: user.fullName,
        //                     },
        //                     with: {
        //                         image: {
        //                             columns: {
        //                                 url: image.url
        //                             }
        //                         },
        //                         birthday: {
        //                             year: birthday.year,
        //                             month: birthday.month,
        //                             day: birthday.day
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //     },
        // });

        return users

        if (!users) {
            throw new Error('User not found');
        }

        /**
         select: {
                friendList: {
                    where: {
                        friend: {
                            birthday: {
                                month: {
                                    equals: currentDate.getMonth() + 1
                                },
                                day: {
                                    equals: currentDate.getDate()
                                }
                            },
                        }
                    },
                    select: {
                        friend: {
                            select: globelSelectBirthday
                        }
                    }
                },
                friendOf: {
                    where: {
                        owner: {
                            birthday: {
                                month: {
                                    equals: currentDate.getMonth() + 1
                                },
                                day: {
                                    equals: currentDate.getDate()
                                }
                            },
                        }
                    },
                    select: {
                        owner: {
                            select: globelSelectBirthday
                        }
                    }
                },
            }
         */

        return users

    } catch (err) {
        console.log({ DrizzleError: err })
    }
}

export const getTodaysFriendsBirthdayHandler = async (params: GetTodayFriendsBirthday) => {
    const { currentDate, userId } = params

    try {

        const users = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                friendList: {
                    where: {
                        friend: {
                            birthday: {
                                month: {
                                    equals: currentDate.getMonth() + 1
                                },
                                day: {
                                    equals: currentDate.getDate()
                                }
                            },
                        }
                    },
                    select: {
                        friend: {
                            select: globelSelectBirthday
                        }
                    }
                },
                friendOf: {
                    where: {
                        owner: {
                            birthday: {
                                month: {
                                    equals: currentDate.getMonth() + 1
                                },
                                day: {
                                    equals: currentDate.getDate()
                                }
                            },
                        }
                    },
                    select: {
                        owner: {
                            select: globelSelectBirthday
                        }
                    }
                },
            },
        })

        const friends = [...users.friendList.map(usr => ({ user: usr.friend })), ...users.friendOf.map(usr => ({ user: usr.owner }))]

        return { friends }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const getTargetMonthFriendsBirthdayHandler = async (params: GetTargetMonthFriendsBirthday) => {
    const { currentMonth, userId } = params

    try {
        const users = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                friendList: {
                    where: {
                        friend: {
                            birthday: {
                                month: {
                                    equals: currentMonth + 1
                                },
                            },
                        }
                    },
                    select: {
                        friend: {
                            select: globelSelectBirthday
                        }
                    }
                },
                friendOf: {
                    where: {
                        owner: {
                            birthday: {
                                month: {
                                    equals: currentMonth + 1
                                },
                            },
                        }
                    },
                    select: {
                        owner: {
                            select: globelSelectBirthday
                        }
                    }
                },
            }
        })

        const friends = [...users.friendList.map(usr => ({ user: usr.friend })), ...users.friendOf.map(usr => ({ user: usr.owner }))]

        return { friends }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


// this handler will return the friends who's birthday with in week from now
export const getUpcomingFriendsBirthdayHandler = async (params: GetUpcomingFriendsBirthday) => {
    const { currentDate, currentMonth, userId } = params

    try {
        const users = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                friendList: {
                    where: {
                        friend: {
                            birthday: {
                                day: {
                                    gt: currentDate,
                                    lte: currentDate + 7
                                },
                                month: {
                                    equals: currentMonth + 1
                                }
                            },
                        }
                    },
                    select: {
                        friend: {
                            select: globelSelectBirthday
                        }
                    }
                },
                friendOf: {
                    where: {
                        owner: {
                            birthday: {
                                day: {
                                    gt: currentDate,
                                    lte: currentDate + 7
                                },
                                month: {
                                    equals: currentMonth + 1
                                }
                            },
                        }
                    },
                    select: {
                        owner: {
                            select: globelSelectBirthday
                        }
                    }
                },
            }
        })

        const friends = [...users.friendList.map(usr => ({ user: usr.friend })), ...users.friendOf.map(usr => ({ user: usr.owner }))]

        return { friends }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const getNextMonthFriendsBirthdayHandler = async (params: GetTargetMonthFriendsBirthday) => {
    const { currentMonth, userId } = params

    try {
        const users = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                friendList: {
                    where: {
                        friend: {
                            birthday: {
                                month: {
                                    equals: currentMonth + 2
                                },
                            },
                        }
                    },
                    select: {
                        friend: {
                            select: globelSelectBirthday
                        }
                    }
                },
                friendOf: {
                    where: {
                        owner: {
                            birthday: {
                                month: {
                                    equals: currentMonth + 2
                                },
                            },
                        }
                    },
                    select: {
                        owner: {
                            select: globelSelectBirthday
                        }
                    }
                },
            }
        })

        const friends = [...users.friendList.map(usr => ({ user: usr.friend })), ...users.friendOf.map(usr => ({ user: usr.owner }))]

        return { friends }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export type GetTodaysFriends = Awaited<ReturnType<typeof getTodaysFriendsBirthdayHandler>>
export type GetOneUserBirthday = {
    id: string;
    fullName: string;
    image: {
        url: string;
    } | null;
    birthday: {
        year: number;
        month: number;
        day: number;
    } | null;
}
