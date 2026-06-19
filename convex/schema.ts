import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
export default defineSchema({
	posts: defineTable({
		title: v.string(),
		body: v.string(),
		authorId: v.string(),
		imageStorageId: v.optional(v.id("_storage")),
		likesCount: v.optional(v.number()),
	}).searchIndex('search_title', { searchField: "title" })
		.searchIndex('search_body', { searchField: "body" }),
	comments: defineTable({
		postId: v.id('posts'),
		authorId: v.string(),
		authorName: v.string(),
		body: v.string()
	}),
	likes: defineTable({
		postId: v.id("posts"),
		userId: v.string(),

	}).index("by_post_and_user", ["postId", "userId"])

})