

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { isAuthenticated } from "@/lib/auth-server";
import { fetchQuery } from "convex/nextjs";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Heart,
  MessageSquare,
  Users,
  PenTool,
} from "lucide-react";

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();

  const [loggedIn, posts] = await Promise.all([
    isAuthenticated(),
    fetchQuery(api.posts.getPosts, {}),
  ]);

  const latestPosts = posts?.slice(0, 3) || [];

  return (
    <div className="flex flex-col gap-24 py-12 md:py-20 animate-fade-in">
      <section className="relative flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-8">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-full blur-3xl opacity-60 animate-pulse duration-4000" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
          <Sparkles className="h-4 w-4" />
          <span>Introducing NextPro Blog</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Discover Stories, Ideas, and{" "}
          <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            Technical Expertise
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
          A real-time blogging platform built with Next.js, Convex, and Better Auth.
          Read, write, comment, and track online viewers reactively.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/blog"
            className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
          >
            Explore Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          {loggedIn ? (
            <Link
              href="/create"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              <PenTool className="mr-2 h-4 w-4" />
              Write a Post
            </Link>
          ) : (
            <Link
              href="/auth/sign-up"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Join the Community
            </Link>
          )}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest Stories</h2>
            <p className="text-muted-foreground mt-1">
              Freshly published articles from our writing community.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-semibold text-primary hover:underline"
          >
            View all articles
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Card
                key={post._id}
                className="group overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    fill
                    src={
                      post.imageUrl ??
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(post._creationTime).toLocaleDateString("en-UK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                      {post.likesCount || 0}
                    </span>
                  </div>
                  <Link href={`/blog/${post._id}`} className="block">
                    <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.body}
                  </p>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <Link
                    href={`/blog/${post._id}`}
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center"
                  >
                    Read article
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-card/50">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-semibold">No posts found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to publish a post and share your story!
            </p>
            {loggedIn && (
              <Link
                href="/create"
                className={buttonVariants({ className: "mt-4", size: "sm" })}
              >
                Write Post
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="space-y-12 bg-muted/30 border rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Built on the Modern Web</h2>
          <p className="text-muted-foreground">
            This platform uses state-of-the-art technologies to deliver a real-time, responsive, and robust blogging experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Live Presence</h3>
            <p className="text-sm text-muted-foreground">
              See who is currently reading a blog post with reactive user facepiles powered by Convex presence.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Real-time Comments</h3>
            <p className="text-sm text-muted-foreground">
              Engage in lively conversations. Comments post and render instantly without reloading.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Convex Reactivity</h3>
            <p className="text-sm text-muted-foreground">
              Database changes push automatically to the client side. No polling or manual fetching required.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Better Auth</h3>
            <p className="text-sm text-muted-foreground">
              Fully secured and unified user session handling, mapped cleanly to the Convex database.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-8 md:p-16 text-center text-primary-foreground space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to share your voice?
        </h2>
        <p className="max-w-xl mx-auto text-primary-foreground/80 text-lg">
          Join our growing community. Create your account to write articles, like posts, and comment in real-time.
        </p>

        <div className="pt-2">
          {loggedIn ? (
            <Link
              href="/create"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "hover:scale-105 transition-transform",
              })}
            >
              <PenTool className="mr-2 h-4 w-4" />
              Write your first article
            </Link>
          ) : (
            <Link
              href="/auth/sign-up"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "hover:scale-105 transition-transform",
              })}
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-24 py-12 md:py-20 animate-pulse">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-16 w-3/4 sm:w-2/3" />
        <Skeleton className="h-12 w-full sm:w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end border-b pb-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
