import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const createPost = mutation({
    args: { title: v.string(), body: v.string(), imageStorageId: v.id("_storage") },

    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) {
            throw new ConvexError("not authenticated user!");
        }

        const blogArticle = await ctx.db.insert('posts', {
            body: args.body,
            title: args.title,
            authorId: user._id,
            imageStorageId: args.imageStorageId,
            likesCount: 0,
        });
        return blogArticle;
    },
});

export const getPosts = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const posts = await ctx.db.query("posts").collect();
        return await Promise.all(
            posts.map(async (post) => {
                let isLiked = false;
                if (args.userId) {
                    const existingLike = await ctx.db
                        .query("likes")
                        .withIndex("by_post_and_user", (q) =>
                            q.eq("postId", post._id).eq("userId", args.userId!)
                        )
                        .unique();
                    isLiked = !!existingLike;
                }

                const resolvedImageUrl = post.imageStorageId !== undefined ?
                    await ctx.storage.getUrl(post.imageStorageId) : null
                return {
                    ...post,
                    likesCount: post.likesCount || 0,
                    isLiked,
                    imageUrl: resolvedImageUrl
                }
            })
        )
    }
});

export const generateImageUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) {
            throw new ConvexError("not authenticated user!");
        }

        return await ctx.storage.generateUploadUrl();
    }
});

export const getPostById = query({
    args: {
        postId: v.id("posts"),
        userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);

        if (!post) {
            return null;
        }

        let isLiked = false;

        if (args.userId) {
            const existingLike = await ctx.db
                .query("likes")
                .withIndex("by_post_and_user", (q) =>
                    q.eq("postId", args.postId).eq("userId", args.userId!)
                )
                .unique();
            isLiked = !!existingLike;
        }

        const resolvedImageUrl = post?.imageStorageId !== undefined ?
            await ctx.storage.getUrl(post.imageStorageId) : null
        return {
            ...post,
            likesCount: post.likesCount || 0,
            isLiked,
            imageUrl: resolvedImageUrl
        }
    }
});

interface searchResult {
    _id: string,
    title: string,
    body: string,
}

export const searchPosts = query({
    args: {
        term: v.string(),
        limit: v.number(),
    },
    handler: async (ctx, args) => {
        const limit = args.limit;
        const results: Array<searchResult> = [];
        const seen = new Set();

        const pushDocs = async (docs: Array<Doc<"posts">>) => {
            for (const doc of docs) {
                if (seen.has(doc._id)) continue;

                seen.add(doc._id);
                results.push({
                    _id: doc._id,
                    title: doc.title,
                    body: doc.body,
                });
                if (results.length >= limit) break;
            }
        }
        const titleMatches = await ctx.db.query("posts").withSearchIndex('search_title', q => q.search("title", args.term)).take(limit)
        await pushDocs(titleMatches)
        if (results.length < limit) {
            const bodyMatches = await ctx.db.query("posts").withSearchIndex('search_body', q => q.search("body", args.term)).take(limit);

            await pushDocs(bodyMatches)
        }
        return results;
    },
});

export const toggleLike = mutation({
    args: { postId: v.id("posts") },

    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user) {
            throw new ConvexError("Not authenticated user!");
        }

        const existingLike = await ctx.db
            .query("likes")
            .withIndex("by_post_and_user", (q) =>
                q.eq("postId", args.postId).eq("userId", user._id)
            )
            .unique();

        const post = await ctx.db.get(args.postId);
        if (!post) throw new ConvexError("Post not found");

        if (existingLike) {
            await ctx.db.delete(existingLike._id);
            await ctx.db.patch(args.postId, {
                likesCount: Math.max(0, (post.likesCount || 0) - 1),
            });
            return { liked: false };
        } else {
            await ctx.db.insert("likes", {
                postId: args.postId,
                userId: user._id,
            });
            await ctx.db.patch(args.postId, {
                likesCount: (post.likesCount || 0) + 1,
            });
            return { liked: true };
        }
    },
});