import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPost = query({
    args: { postId: v.id('posts') },
    handler: async (ctx, args) => {
        const data = await ctx.db
            .query('comments')
            .filter((q) => q.eq(q.field('postId'), args.postId))
            .order("desc")
            .collect();

        return data;

    }
})

export const createComment = mutation({
    args: {
        postId: v.id('posts'),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) {
            throw new Error("User not found");
        }

        return await ctx.db.insert('comments', {
            postId: args.postId,
            body: args.body,
            authorId: user._id,
            authorName: user.name

        })

    }
})  