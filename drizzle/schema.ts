import { pgTable, uniqueIndex, foreignKey, text, integer, timestamp, serial, smallint, index, varchar, boolean } from "drizzle-orm/pg-core"

import { relations, sql } from "drizzle-orm"

export const page = pgTable("Page", {
	id: text("id").primaryKey().notNull(),
	identifier: text("identifier").notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	title: text("title").notNull(),
	coverImageId: integer("coverImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	profileImageId: integer("profileImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	about: text("about"),
	category: text("category"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	score: integer("score").default(0).notNull(),
	email: text("email"),
	serviceArea: text("serviceArea"),
	services: text("services").array(),
	websiteUrl: text("website_url"),
},
	(table) => {
		return {
			idKey: uniqueIndex("Page_id_key").on(table.id),
			identifierKey: uniqueIndex("Page_identifier_key").on(table.identifier),
			coverImageIdKey: uniqueIndex("Page_coverImageId_key").on(table.coverImageId),
			profileImageIdKey: uniqueIndex("Page_profileImageId_key").on(table.profileImageId),
		}
	});

export const pageRelations = relations(page, ({ one, many }) => ({
	reviewList: many(pageReview),
	profileImage: one(image, {
		relationName: 'imageToPageProfile',
		fields: [page.profileImageId],
		references: [image.id]
	}),
	mediaList: many(media),
	invitationList: many(pageInvitation),
	likeList: many(user, { relationName: 'UserLikePages' }),
	postList: many(post, {
		relationName: 'postPageAuthor'
	}),
	contactList: many(contact),
	messageList: many(message),
	priceRange: one(priceRange, {
		fields: [page.id],
		references: [priceRange.pageId]
	}),
	coverImage: one(user, {
		fields: [page.ownerId],
		references: [user.id],
	}),
	owner: one(image, {
		relationName: 'imageToPageCover',
		fields: [page.coverImageId],
		references: [image.id],
	}),
}))

export const priceRange = pgTable("PriceRange", {
	id: serial("id").primaryKey().notNull(),
	pageId: text("pageId").notNull().references(() => page.id, { onDelete: "restrict", onUpdate: "cascade" }),
	from: integer("from").notNull(),
	to: integer("to").notNull(),
	currency: text("currency").notNull(),
},
	(table) => {
		return {
			pageIdKey: uniqueIndex("PriceRange_pageId_key").on(table.pageId),
		}
	});

export const priceRangeRelations = relations(priceRange, ({ one }) => ({
	page: one(page, {
		fields: [priceRange.pageId],
		references: [page.id]
	})
}))

export const pageReview = pgTable("PageReview", {
	id: text("id").primaryKey().notNull(),
	pageId: text("pageId").notNull().references(() => page.id, { onDelete: "restrict", onUpdate: "cascade" }),
	authorId: text("authorId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	content: text("content").notNull(),
	rate: smallint("rate").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("PageReview_id_key").on(table.id),
		}
	});

export const pageReviewRelations = relations(pageReview, ({ one }) => ({
	page: one(page, {
		fields: [pageReview.pageId],
		references: [page.id]
	}),
	author: one(user, {
		fields: [pageReview.authorId],
		references: [user.id]
	})
}))

export const groupInvitation = pgTable("GroupInvitation", {
	id: text("id").primaryKey().notNull(),
	senderId: text("senderId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	groupId: text("groupId").notNull().references(() => group.id, { onDelete: "restrict", onUpdate: "cascade" }),
	recipientId: text("recipientId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

export const groupInvitationRelations = relations(groupInvitation, ({ one }) => ({
	sender: one(user, {
		relationName: 'GroupInvitationSender',
		fields: [groupInvitation.senderId],
		references: [user.id]
	}),
	recipient: one(user, {
		relationName: 'GroupInvitationRecipient',
		fields: [groupInvitation.recipientId],
		references: [user.id]
	}),
	group: one(group, {
		fields: [groupInvitation.groupId],
		references: [group.id]
	}),
}))

export const eventInvitation = pgTable("EventInvitation", {
	id: text("id").primaryKey().notNull(),
	senderId: text("senderId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	recipientId: text("recipientId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	eventId: text("eventId").notNull().references(() => event.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

export const eventInvitationRelations = relations(eventInvitation, ({ one }) => ({
	sender: one(user, {
		relationName: 'EventInvitationSender',
		fields: [eventInvitation.senderId],
		references: [user.id]
	}),
	recipient: one(user, {
		relationName: 'EventInvitationRecipient',
		fields: [eventInvitation.recipientId],
		references: [user.id]
	}),
	event: one(event, {
		relationName: 'EventInvitationRecipient',
		fields: [eventInvitation.eventId],
		references: [event.id]
	}),
}))

export const userMutedGroupList = pgTable("_UserMutedGroupList", {
	a: text("A").notNull().references(() => group.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_UserMutedGroupList_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const blockedUser = pgTable("BlockedUser", {
	id: text("id").primaryKey().notNull(),
	ownerId: text("ownerId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => {
		return {
			ownerIdKey: uniqueIndex("BlockedUser_ownerId_key").on(table.ownerId),
		}
	});

export const blockedUserRelations = relations(blockedUser, ({ one, many }) => ({
    owner: one(user, {
        relationName: 'UserBlockedList',
        fields: [blockedUser.ownerId],
        references: [user.id]
    }),
    userList: many(user, { relationName: 'UserBlockedByOther' })
}))

export const userBlockedByOther = pgTable("_UserBlockedByOther", {
	a: text("A").notNull().references(() => blockedUser.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_UserBlockedByOther_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const example = pgTable("Example", {
	id: text("id").primaryKey().notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
});

export const image = pgTable("Image", {
	id: serial("id").primaryKey().notNull(),
	ownerId: text("ownerId"),
	eventId: text("eventId"),
	pageId: text("pageId"),
	pageProfileId: text("pageProfileId"),
	groupId: text("groupId"),
	groupProfileId: text("groupProfileId"),
	url: text("url").notNull(),
	path: text("path").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

// check here . . .
export const imageRelations = relations(image, ({ one }) => ({
	groupProfile: one(group, {
		relationName: 'imageToGroupProfile',
		fields: [image.id],
		references: [group.profileImageId],
	}),
	groupCover: one(group, {
		relationName: 'imageToGroupCover',
		fields: [image.id],
		references: [group.coverImageId],
	}),
	pageProfile: one(page, {
		relationName: 'imageToPageProfile',
		fields: [image.id],
		references: [page.profileImageId],
	}),
	pageCover: one(page, {
		relationName: 'imageToPageCover',
		fields: [image.id],
		references: [page.coverImageId],
	}),
	eventCover: one(event, {
		relationName: 'imageToEventCover',
		fields: [image.id],
		references: [event.coverImageId],
	}),
	userCoverImage: one(user, {
		relationName: 'userCover',
		fields: [image.id],
		references: [user.userCoverId],
	}),
}))

export const birthday = pgTable("Birthday", {
	id: serial("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	year: integer("year").notNull(),
	month: integer("month").notNull(),
	day: integer("day").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			userIdKey: uniqueIndex("Birthday_userId_key").on(table.userId),
		}
	});

export const birthdayRelations = relations(birthday, ({ one }) => ({
	user: one(user, {
		fields: [birthday.userId],
		references: [user.id]
	})
}))

export const friendship = pgTable("Friendship", {
	id: serial("id").primaryKey().notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	friendId: text("friendId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});


export const friendShipRelations = relations(friendship, ({ one }) => ({
	owner: one(user, {
		relationName: 'friendshipOwner',
		fields: [friendship.ownerId],
		references: [user.id]
	}),
	friend: one(user, {
		relationName: 'friend',
		fields: [friendship.friendId],
		references: [user.id]
	})
}))


export const addFriendRequest = pgTable("AddFriendRequest", {
	id: serial("id").primaryKey().notNull(),
	senderId: text("senderId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	receiverId: text("receiverId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	status: text("status").default('pending').notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

export const addFriendRequestRelations = relations(addFriendRequest, ({ one }) => ({
	sender: one(user, {
		relationName: 'SentFriendRequests',
		fields: [addFriendRequest.senderId],
		references: [user.id],
	}),
	receiver: one(user, {
		relationName: 'ReceivedFriendRequests',
		fields: [addFriendRequest.receiverId],
		references: [user.id],
	})
}))

export const mentionList = pgTable("MentionList", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

export const mentionListRelations = relations(mentionList, ({ one, many }) => ({
	post: one(post, {
		fields: [mentionList.id],
		references: [post.mentionListId]
	}),
	sharedPost: one(sharedPost, {
		fields: [mentionList.id],
		references: [sharedPost.mentionListId]
	}),
	userList: many(user)
}));

export const hiddenPost = pgTable("HiddenPost", {
	id: text("id").notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	reason: text("reason"),
	postId: text("postId").notNull().references(() => post.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("HiddenPost_id_key").on(table.id),
		}
	});

export const hiddenPostRelations = relations(hiddenPost, ({ one }) => ({
	owner: one(user, {
		fields: [hiddenPost.ownerId],
		references: [user.id]
	}),
	post: one(post, {
		fields: [hiddenPost.postId],
		references: [post.id]
	}),
}))

export const comment = pgTable("Comment", {
	id: text("id").primaryKey().notNull(),
	postId: text("postId").references(() => post.id, { onDelete: "set null", onUpdate: "cascade" }),
	sharedPostId: text("sharedPostId").references(() => sharedPost.id, { onDelete: "set null", onUpdate: "cascade" }),
	authorId: text("authorId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Comment_id_key").on(table.id),
		}
	});

export const commentRelations = relations(comment, ({ one, many }) => ({
	post: one(post, {
		fields: [comment.postId],
		references: [post.id]
	}),
	sharedPost: one(sharedPost, {
		fields: [comment.sharedPostId],
		references: [sharedPost.id]
	}),
	author: one(user, {
		relationName: 'commentUserAuthor',
		fields: [comment.authorId],
		references: [user.id]
	}),
	LikeList: many(user, {
		relationName: 'commentUserSubject'
	}),
	replyList: many(reply)
}))

export const reply = pgTable("Reply", {
	id: text("id").primaryKey().notNull(),
	commentId: text("commentId").notNull().references(() => comment.id, { onDelete: "cascade", onUpdate: "cascade" }),
	authorId: text("authorId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Reply_id_key").on(table.id),
		}
	});

export const replyRelations = relations(reply, ({ one, many }) => ({
	comment: one(comment, {
		fields: [reply.commentId],
		references: [comment.id]
	}),
	author: one(user, {
		fields: [reply.authorId],
		references: [user.id]
	}),
	likeList: many(user, { relationName: 'userReplayLike' })
}))

export const checkIn = pgTable("CheckIn", {
	id: text("id").primaryKey().notNull(),
	postId: text("postId").references(() => post.id, { onDelete: "set null", onUpdate: "cascade" }),
	sharedPostId: text("sharedPostId").references(() => sharedPost.id, { onDelete: "set null", onUpdate: "cascade" }),
	location: text("location").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("CheckIn_id_key").on(table.id),
			postIdKey: uniqueIndex("CheckIn_postId_key").on(table.postId),
			sharedPostIdKey: uniqueIndex("CheckIn_sharedPostId_key").on(table.sharedPostId),
		}
	});

export const checkInRelations = relations(checkIn, ({ one, many }) => ({
	post: one(post, {
		fields: [checkIn.postId],
		references: [post.id]
	}),
	sharedPost: one(sharedPost, {
		fields: [checkIn.sharedPostId],
		references: [sharedPost.id]
	})
}))

export const pageInvitation = pgTable("PageInvitation", {
	id: text("id").primaryKey().notNull(),
	senderId: text("senderId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	pageId: text("pageId").notNull().references(() => page.id, { onDelete: "restrict", onUpdate: "cascade" }),
	recipientId: text("recipientId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

export const pageInvitationRelations = relations(pageInvitation, ({ one }) => ({
	sender: one(user, {
		relationName: 'PageInvitationSender',
		fields: [pageInvitation.senderId],
		references: [user.id]
	}),
	page: one(page, {
		fields: [pageInvitation.pageId],
		references: [page.id]
	}),
	recipient: one(user, {
		relationName: 'PageInvitationRecipient',
		fields: [pageInvitation.recipientId],
		references: [user.id]
	}),
}))

export const story = pgTable("Story", {
	id: text("id").primaryKey().notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	lastUpdate: timestamp("lastUpdate", { precision: 3, mode: 'string' }).notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Story_id_key").on(table.id),
		}
	});

export const storyRelations = relations(story, ({ one, many }) => ({
	owner: one(user, {
		relationName: 'userStoryAuthor',
		fields: [story.ownerId],
		references: [user.id]
	}),
	media: one(media, {
		fields: [story.id],
		references: [media.storyId]
	}),
	likeList: many(user, {
		relationName: 'userStoryLike',
	}),
	watchedByList: many(user, {
		relationName: 'userWhatchStory',
	})
}))

export const contact = pgTable("Contact", {
	id: text("id").primaryKey().notNull(),
	pageId: text("pageId").notNull().references(() => page.id, { onDelete: "restrict", onUpdate: "cascade" }),
	name: text("name").notNull(),
	value: text("value").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Contact_id_key").on(table.id),
		}
	});

export const contactRelations = relations(contact, ({ one }) => ({
	page: one(page, {
		fields: [contact.pageId],
		references: [page.id]
	})
}))

export const message = pgTable("Message", {
	id: serial("id").primaryKey().notNull(),
	sendId: text("sendId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }).references(() => page.id, { onDelete: "restrict", onUpdate: "cascade" }),
	conversationId: integer("conversationId").notNull().references(() => conversation.id, { onDelete: "restrict", onUpdate: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Message_id_key").on(table.id),
		}
	});

export const messageRelations = relations(message, ({ one }) => ({
	conversation: one(conversation, {
		fields: [message.conversationId],
		references: [conversation.id],
	}),
	pageSender: one(page, {
		fields: [message.sendId],
		references: [page.id]
	}),
	userSender: one(user, {
		fields: [message.sendId],
		references: [user.id]
	}),
}));


export const conversation = pgTable("Conversation", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Conversation_id_key").on(table.id),
		}
	});

export const conversationRelations = relations(conversation, ({ many }) => ({
	messageList: many(message),
	users: many(user)
}));

export const notification = pgTable("Notification", {
	id: serial("id").primaryKey().notNull(),
	senderId: text("senderId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	recieverId: text("recieverId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	content: text("content").notNull(),
	link: text("link"),
	type: text("type"),
	message: text("message"),
	status: text("status").default('unread').notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Notification_id_key").on(table.id),
		}
	});

export const notificationRelations = relations(notification, ({ one }) => ({
	sender: one(user, {
		relationName: 'notificationUserAuthor',
		fields: [notification.senderId],
		references: [user.id]
	}),
	reciever: one(user, {
		relationName: 'notificationUserReciever',
		fields: [notification.recieverId],
		references: [user.id]
	})
}))

export const event = pgTable("Event", {
	id: text("id").primaryKey().notNull(),
	authorId: text("authorId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	title: text("title").notNull(),
	category: text("category").notNull(),
	description: text("description").notNull(),
	coverImageId: integer("coverImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	eventTime: timestamp("eventTime", { precision: 3, mode: 'string' }).notNull(),
	type: text("type").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Event_id_key").on(table.id),
			coverImageIdKey: uniqueIndex("Event_coverImageId_key").on(table.coverImageId),
		}
	});

export const eventRelations = relations(event, ({ one, many }) => ({
	author: one(user, {
		relationName: 'userEventAuthor',
		fields: [event.authorId],
		references: [user.id],
	}),
	image: one(image, {
		relationName: 'imageToEventCover',
		fields: [event.coverImageId],
		references: [image.id],
	}),
	invitationList: many(eventInvitation),
	goingList: many(eventInvitation, { relationName: 'eventUserGoingList' }),
	interestedList: many(eventInvitation, { relationName: 'eventUserInterestedList' }),
}))

export const bookmark = pgTable("Bookmark", {
	id: serial("id").primaryKey().notNull(),
	postId: text("postId").references(() => post.id, { onDelete: "set null", onUpdate: "cascade" }),
	sharedPostId: text("sharedPostId").references(() => sharedPost.id, { onDelete: "set null", onUpdate: "cascade" }),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Bookmark_id_key").on(table.id),
		}
	});

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
	post: one(post, {
		fields: [bookmark.postId],
		references: [post.id]
	}),
	sharedPost: one(sharedPost, {
		fields: [bookmark.sharedPostId],
		references: [sharedPost.id]
	}),
	owner: one(user, {
		fields: [bookmark.ownerId],
		references: [user.id]
	}),
}))

export const getInGroupRequest = pgTable("GetInGroupRequest", {
	id: serial("id").primaryKey().notNull(),
	applierId: text("applierId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	groupId: text("groupId").notNull().references(() => group.id, { onDelete: "restrict", onUpdate: "cascade" }),
	isAccepted: boolean("isAccepted"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("GetInGroupRequest_id_key").on(table.id),
		}
	});

export const getInGroupRequestRelations = relations(getInGroupRequest, ({ one }) => ({
	group: one(group, {
		fields: [getInGroupRequest.groupId],
		references: [group.id]
	}),
	applier: one(user, {
		fields: [getInGroupRequest.applierId],
		references: [user.id]
	}),
}))

export const postToUser = pgTable("_PostToUser", {
	a: text("A").notNull().references(() => post.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_PostToUser_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const mentionListToUser = pgTable("_MentionListToUser", {
	a: integer("A").notNull().references(() => mentionList.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_MentionListToUser_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const sharedPostToUser = pgTable("_SharedPostToUser", {
	a: text("A").notNull().references(() => sharedPost.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_SharedPostToUser_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const commentUserSubject = pgTable("_commentUserSubject", {
	a: text("A").notNull().references(() => comment.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_commentUserSubject_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const userReplayLike = pgTable("_userReplayLike", {
	a: text("A").notNull().references(() => reply.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_userReplayLike_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const userLikePages = pgTable("_UserLikePages", {
	a: text("A").notNull().references(() => page.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_UserLikePages_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const userStoryLike = pgTable("_userStoryLike", {
	a: text("A").notNull().references(() => story.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_userStoryLike_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const conversationToUser = pgTable("_ConversationToUser", {
	a: text("A").notNull().references(() => conversation.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_ConversationToUser_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const eventUserInterestedList = pgTable("_eventUserInterestedList", {
	a: text("A").notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_eventUserInterestedList_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const eventUserGoingList = pgTable("_eventUserGoingList", {
	a: text("A").notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_eventUserGoingList_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const groupUserMember = pgTable("_groupUserMember", {
	a: text("A").notNull().references(() => group.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: text("B").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => {
		return {
			abUnique: uniqueIndex("_groupUserMember_AB_unique").on(table.a, table.b),
			bIdx: index().on(table.b),
		}
	});

export const media = pgTable("Media", {
	id: text("id").primaryKey().notNull(),
	postId: text("postId").references(() => post.id, { onDelete: "set null", onUpdate: "cascade" }),
	storyId: text("storyId").references(() => story.id, { onDelete: "set null", onUpdate: "cascade" }),
	url: text("url").notNull(),
	path: text("path").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	ownerId: text("ownerId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	pageOwnerId: text("pageOwnerId").references(() => page.id, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => {
		return {
			idKey: uniqueIndex("Media_id_key").on(table.id),
			storyIdKey: uniqueIndex("Media_storyId_key").on(table.storyId),
		}
	});

export const mediaRelations = relations(media, ({ one }) => ({
	post: one(post, {
		fields: [media.postId],
		references: [post.id]
	}),
	story: one(story, {
		fields: [media.storyId],
		references: [story.id]
	}),
	owner: one(user, {
		fields: [media.ownerId],
		references: [user.id]
	}),
	pageOwner: one(page, {
		fields: [media.pageOwnerId],
		references: [page.id]
	}),
}))

export const group = pgTable("Group", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	coverImageId: integer("coverImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	profileImageId: integer("profileImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	rules: text("rules").notNull(),
	location: text("location"),
	category: text("category").notNull(),
	about: text("about"),
	score: integer("score").default(0).notNull(),
	isPrivate: boolean("isPrivate").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	isVisiable: boolean("isVisiable").default(true).notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Group_id_key").on(table.id),
			coverImageIdKey: uniqueIndex("Group_coverImageId_key").on(table.coverImageId),
			profileImageIdKey: uniqueIndex("Group_profileImageId_key").on(table.profileImageId),
		}
	});

export const groupRelations = relations(group, ({ one, many }) => ({
	mutedByOther: many(user, {
		relationName: 'UserMutedGroupList',
	}),
	invitationList: many(groupInvitation),
	getInRequest: many(getInGroupRequest),
	groupMember: many(getInGroupRequest, {
		relationName: 'groupUserMember'
	}),
	postList: many(post, {
		relationName: 'postGroupAccountHolder'
	}),
	sharedPostList: many(post, {
		relationName: 'sharedPostGroupAccountHolder'
	}),
	profileImage: one(image, {
		relationName: 'imageToGroupProfile',
		fields: [group.profileImageId],
		references: [image.id],
	}),
	coverImage: one(image, {
		relationName: 'imageToGroupCover',
		fields: [group.coverImageId],
		references: [image.id],
	}),
	owner: one(user, {
		fields: [group.ownerId],
		references: [user.id]
	})
}))

export const post = pgTable("Post", {
	id: text("id").primaryKey().notNull(),
	type: text("type").default('original').notNull(),
	userAuthorId: text("userAuthorId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	pageAuthorId: text("pageAuthorId").references(() => page.id, { onDelete: "set null", onUpdate: "cascade" }),
	content: text("content").notNull(),
	mentionListId: integer("mentionListId").references(() => mentionList.id, { onDelete: "set null", onUpdate: "cascade" }),
	feeling: varchar("feeling", { length: 20 }),
	whoCanSee: text("whoCanSee").default('all').notNull(),
	accountHolderId: text("accountHolderId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	groupHolderId: text("groupHolderId").references(() => group.id, { onDelete: "set null", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	lastUpdate: timestamp("lastUpdate", { precision: 3, mode: 'string' }).notNull(),
	score: integer("score").default(0).notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("Post_id_key").on(table.id),
			mentionListIdKey: uniqueIndex("Post_mentionListId_key").on(table.mentionListId),
		}
	});

export const postRelations = relations(post, (({ one, many }) => ({
	requestHiddenUserList: many(hiddenPost),
	groupHolder: one(group, {
		relationName: 'postGroupAccountHolder',
		fields: [post.groupHolderId],
		references: [group.id]
	}),
	accountHolder: one(user, {
		relationName: 'postUserAccountHolder',
		fields: [post.accountHolderId],
		references: [user.id]
	}),
	bookMarkList: many(bookmark),
	commentList: many(comment),
	sharedList: many(sharedPost),
	likeList: many(user),
	mediaList: many(media),
	checkIn: one(checkIn, {
		fields: [post.id],
		references: [checkIn.postId]
	}),
	mentionList: one(mentionList, {
		fields: [post.mentionListId],
		references: [mentionList.id]
	}),
	userAuthor: one(user, {
		relationName: 'postUserAccountAuthor',
		fields: [post.userAuthorId],
		references: [user.id]
	}),
	pageAuthor: one(page, {
		relationName: 'postUserAccountAuthor',
		fields: [post.pageAuthorId],
		references: [page.id]
	}),
	hashtagList:many(hashtag)

})))

export const sharedPost = pgTable("SharedPost", {
	id: text("id").primaryKey().notNull(),
	type: text("type").default('shared').notNull(),
	authorId: text("authorId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
	postId: text("postId").references(() => post.id, { onDelete: "set null", onUpdate: "cascade" }),
	mentionListId: integer("mentionListId").references(() => mentionList.id, { onDelete: "set null", onUpdate: "cascade" }),
	content: text("content").notNull(),
	feeling: varchar("feeling", { length: 20 }),
	whoCanSee: text("whoCanSee").default('all').notNull(),
	accountHolderId: text("accountHolderId").references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	groupHolderId: text("groupHolderId").references(() => group.id, { onDelete: "set null", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	lastUpdate: timestamp("lastUpdate", { precision: 3, mode: 'string' }).notNull(),
	reSharedFromId: text("reSharedFromId"),
	score: integer("score").default(0).notNull(),
},
	(table) => {
		return {
			idKey: uniqueIndex("SharedPost_id_key").on(table.id),
			mentionListIdKey: uniqueIndex("SharedPost_mentionListId_key").on(table.mentionListId),
			sharedPostReSharedFromIdFkey: foreignKey({
				columns: [table.reSharedFromId],
				foreignColumns: [table.id]
			}).onUpdate("cascade").onDelete("set null"),
		}
	});

export const sharedPostRelations = relations(sharedPost, ({ one, many }) => ({
	sharedList: many(sharedPost),
	reSharedFrom: one(sharedPost, {
		relationName: 'ReSharedFrom',
		fields: [sharedPost.reSharedFromId],
		references: [sharedPost.id]
	}),
	groupHolder: one(group, {
		relationName: 'sharedPostGroupAccountHolder',
		fields: [sharedPost.groupHolderId],
		references: [group.id],
	}),
	accountHolder: one(user, {
		relationName: 'sharedPostUserAccountHolder',
		fields: [sharedPost.accountHolderId],
		references: [user.id],
	}),
	checkIn: one(checkIn, {
		fields: [sharedPost.id],
		references: [checkIn.sharedPostId]
	}),
	commentList: many(comment),
	likeList: many(user),
	bookMarkList: many(bookmark),
	mentionList: one(mentionList, {
		fields: [sharedPost.mentionListId],
		references: [mentionList.id]
	}),
	post: one(post, {
		fields: [sharedPost.postId],
		references: [post.id]
	}),
	userAuthor: one(user, {
		relationName: 'sharedPostUserAccountAuthor',
		fields: [sharedPost.authorId],
		references: [user.id]
	}),
	hashtagList:many(hashtag)
}))

export const user = pgTable("User", {
	id: text("id").primaryKey().notNull().default(sql`(uuid())`),
	sessionId: text("sessionId").primaryKey().notNull().default(sql`(uuid())`),
	fullName: text("fullName").default('').notNull(),
	username: text("username").default('').notNull(),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'date' }),
	isVerified: boolean("isVerified").default(false).notNull(),
	password: text("password").default('').notNull(),
	gettingStart: varchar("gettingStart", { length: 1 }).default('1').notNull(),
	gender: varchar("gender", { length: 1 }).default('m').notNull(),
	contentLanguage: varchar("contentLanguage", { length: 2 }).default('en').notNull(),
	userImageId: integer("userImageId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	userCoverId: integer("userCoverId").references(() => image.id, { onDelete: "set null", onUpdate: "cascade" }),
	interestedTopics: text("interestedTopics").array().notNull().default([]),
	bio: text("bio"),
	livingLocation: text("livingLocation"),
	fromLocation: text("fromLocation"),
	status: text("status"),
	isPrivate: boolean("isPrivate").default(false).notNull(),
	phoneNo: varchar("phoneNo", { length: 20 }),
	phoneNoCode: varchar("phoneNoCode", { length: 3 }),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	lastUpdate: timestamp("lastUpdate", { precision: 3, mode: 'string' }).defaultNow().default(sql`CURRENT_TIMESTAMP`).notNull(),
	score: integer("score").default(0).notNull(),
	isChatBillOn: boolean("isChatBillOn").default(false).notNull(),
	isVisiable: boolean("isVisiable").default(true).notNull(),
	platformLanguage: varchar("platformLanguage", { length: 2 }).default('en').notNull(),
},
	(table) => {
		return {
			emailKey: uniqueIndex("User_email_key").on(table.email),
			userImageIdKey: uniqueIndex("User_userImageId_key").on(table.userImageId),
			userCoverIdKey: uniqueIndex("User_userCoverId_key").on(table.userCoverId),
		}
	});

export const userRelations = relations(user, ({ one, many }) => ({
	messageList: many(message),
	conversationList: many(conversation),
	image: one(image, {
		fields: [user.id],
		references: [image.ownerId],
	}),
	coverImage: one(image, {
		relationName: 'userCover',
		fields: [user.id],
		references: [image.ownerId],
	}),
	watchedStory: many(story, { relationName: 'userWhatchStory' }),
	mutedGroupList: many(group, { relationName: 'UserMutedGroupList' }),
	blockedByOthers: many(blockedUser, { relationName: 'UserBlockedByOther' }),
	blockedList: one(blockedUser, {
		relationName: 'UserBlockedList',
		fields: [user.id],
		references: [blockedUser.ownerId]
	}),
	sendedEventInvitationList: many(eventInvitation, { relationName: 'EventInvitationSender' }),
	recievedEventInvitationList: many(eventInvitation, { relationName: 'EventInvitationRecipient' }),
	reviewList: many(pageReview),
	sendedGroupInvitationList: many(groupInvitation, { relationName: 'GroupInvitationSender' }),
	recievedGroupInvitationList: many(groupInvitation, { relationName: 'GroupInvitationRecipient' }),
	sendedPageInvitationList: many(pageInvitation, { relationName: 'PageInvitationSender' }),
	recievedPageInvitationList: many(pageInvitation, { relationName: 'PageInvitationRecipient' }),
	friendList: many(friendship, { relationName: 'friendshipOwner' }),
	friendOf: many(friendship, { relationName: 'friend' }),
	postMentionedIn: many(mentionList),
	receiveredFriendRequestList: many(addFriendRequest, { relationName: 'ReceivedFriendRequests' }),
	sendedFriendRequestList: many(addFriendRequest, { relationName: 'SentFriendRequests' }),
	likedSharedPosts: many(sharedPost),
	likedPosts: many(post),
	likePageList: many(page),
	requestHiddenPost: many(hiddenPost),
	appliedGroupList: many(getInGroupRequest),
	inGroupList: many(group),
	groupList: many(group),
	bookmarkList: many(bookmark),
	interestedList: many(event, { relationName: 'eventUserInterestedList' }),
	goingEventList: many(event, { relationName: 'eventUserGoingList' }),
	notificationList: many(notification, { relationName: 'notificationUserAuthor' }),
	recievedNotificationList: many(notification, { relationName: 'notificationUserReciever' }),
	eventList: many(event, { relationName: 'userEventAuthor' }),
	mediaList: many(media),
	pageList: many(page),
	storiesList: many(story, { relationName: 'userStoryAuthor' }),
	likedStoriesList: many(story, { relationName: 'userStoryLike' }),
	postList: many(post, { relationName: 'postUserAccountAuthor' }),
	holdingPostList: many(post, { relationName: 'postUserAccountHolder' }),
	holdingSharedPostList: many(sharedPost, { relationName: 'sharedPostUserAccountHolder' }),
	sharedPostList: many(sharedPost, { relationName: 'sharedPostUserAccountAuthor' }),
	commentList: many(comment, { relationName: 'commentUserAuthor' }),
	likeCommentList: many(comment, { relationName: 'commentUserSubject' }),
	replyList: many(reply, { relationName: 'userReplayLike' }),
	writtenreplyList: many(reply, { relationName: 'userReplayLikeOwner' }),
	birthday: one(birthday)
}))




export const hashtag = pgTable("Hashtag", {
	id: serial("id").primaryKey().notNull(),
	title: text('title').notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	lastUpdate: timestamp("lastUpdate", { precision: 3, mode: 'string' }).defaultNow().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const hashtagRelations = relations(hashtag,({many})=>({
	postList:many(post),
	sharedPostList:many(sharedPost)
}))
