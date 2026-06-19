import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import LikeButton from "@/components/web/LikePosts"
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
    params: Promise<{ postId: Id<"posts"> }>;
}

export async function generateMetadata({
    params,
}: PostIdRouteProps): Promise<Metadata> {
    const { postId } = await params;
    const token = await getToken();
    const post = await fetchQuery(api.posts.getPostById, { postId: postId }, { token });

    if (!post) {
        return {
            title: "Post not found",
        };
    }

    return {
        title: post.title,
        description: post.body,
    };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
    const { postId } = await params;
    const token = await getToken();

    const userId = await fetchQuery(api.presence.getUserId, {}, { token });

    const [post, preloadedComments] = await Promise.all([
        await fetchQuery(
            api.posts.getPostById,
            {
                postId: postId,
                userId: userId ?? undefined
            },
            { token }
        ),
        await preloadQuery(api.comments.getCommentsByPost, { postId: postId }),
    ]);

    if (!post) {
        return (
            <div>Post not found</div>
        );
    }
    const isLikedByUser = post.isLiked ?? false;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 fade-in duration-500 relative">
            <Link className={buttonVariants({
                variant: "outline",
                className: "mb-6"
            })} href="/blog">
                <ArrowLeft />
                Back to Blog
            </Link>

            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden shadow-sm">
                <Image
                    fill={true}
                    src={post.imageUrl || "https://static.vecteezy.com/system/resources/thumbnails/023/009/485/small_2x/abstract-animal-owl-portrait-with-colorful-double-exposure-paint-with-generative-ai-free-photo.jpeg"}
                    alt={post.title}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="space-y-4 flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{post.title}</h1>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Posted on: {new Date(post._creationTime).toLocaleDateString("en-UK")}</p>
                    <LikeButton
                        postId={post._id}
                        initialLikes={post.likesCount || 0}
                        isInitiallyLiked={isLikedByUser}
                    />

                    {userId && <PostPresence roomId={post._id} userId={userId} />}
                </div>
                <Separator className="my-8" />
                <p className="text-lg leading-relaxed text-foreground/90">{post.body}</p>
                <Separator className="my-8" />
            </div>
            <CommentSection preloadedComments={preloadedComments} />
        </div>
    );
}