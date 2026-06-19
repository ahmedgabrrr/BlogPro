"use client"
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";




export function CommentSection(props: {
    preloadedComments: Preloaded<typeof api.comments.getCommentsByPost>;
}) {
    const params = useParams<{ postId: Id<"posts"> }>();
    const data = usePreloadedQuery(props.preloadedComments);
    const [isPending, startTransition] = useTransition();
    const addComment = useMutation(api.comments.createComment)
    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.postId,
        },
    });

    async function onSubmit(data: z.infer<typeof commentSchema>) {
        try {
            await addComment(data);
            form.reset();
            toast.success('Comment added successfully')
        } catch (error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    }

    if (data === undefined) {
        return <p>Loading...</p>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 ">
                <MessageSquare className="size-5" />
                <h2 className="text-lg font-bold">{data.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-8">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Controller name="body" control={form.control} render={({ field, fieldState }) => <Field>
                        <FieldLabel>Comment</FieldLabel>
                        <Textarea aria-invalid={fieldState.invalid} placeholder="Share Your Thoughts" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>} />
                    <Button className="py-5 " disabled={isPending}>{isPending ? (
                        <>
                            <Loader2 className="animate-spin size-4" />
                        </>
                    ) : "Comment"}</Button>
                </form>

                {data?.length > 0 && <Separator />}


                <section className="space-y-6">
                    {data?.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`}
                                    alt={comment.authorName} />

                                <AvatarFallback>
                                    {comment.authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>

                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 justify-between">
                                    <h4 className="font-semibold text-sm">
                                        {comment.authorName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{new Date(comment._creationTime).toLocaleDateString("en-Uk")}</p>

                                </div>
                                <p className="text-sm text-foreground/90">{comment.body}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>

        </Card>
    )

}