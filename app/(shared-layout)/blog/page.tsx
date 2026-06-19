import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";


export const metadata: Metadata = {
    title: "Blog Page | Articles",
    description: "Blog Page",
};


export default function BlogPage() {
    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Our Blog
                </h1>
                <p className="text-xl max-w-2xl mx-auto text-muted-foreground pt-4">
                    Read our latest posts and articles
                </p>
            </div>
            {/* <Suspense fallback={<SkeletonLoading />}> */}
            <LoadingBlog />
            {/* </Suspense> */}

        </div>
    )
}

async function LoadingBlog() {
    // "use cache"

    // cacheLife("hours")
    // cacheTag("blog")

    await connection();

    const posts = await fetchQuery(api.posts.getPosts, {});

    return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {posts?.map((post) => (
            <Card key={post._id} className="pt-0">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        fill={true}
                        src={post.imageUrl ?? "https://static.vecteezy.com/system/resources/thumbnails/023/009/485/small_2x/abstract-animal-owl-portrait-with-colorful-double-exposure-paint-with-generative-ai-free-photo.jpeg"}
                        alt=""
                        className="object-cover"
                    />
                </div>
                <CardContent >
                    <Link href={`/blog/${post._id}`}>
                        <p className="text-lg font-bold hover:text-primary cursor-pointer">{post.title}</p>
                    </Link>
                </CardContent>
                <CardFooter>
                    <Link className={buttonVariants({
                        className: "w-full ",

                    })} href={`/blog/${post._id}`}>
                        Read More
                    </Link>
                </CardFooter>


            </Card>
        ))}
    </div>;
}

function SkeletonLoading() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 w-full space-y-3" />
                    <div className="space-y-2 flex flex-col">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))
            }
        </div>
    )
}