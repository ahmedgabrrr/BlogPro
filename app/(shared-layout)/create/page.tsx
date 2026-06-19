"use client";
import { createBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod"

export default function CreateRoute() {
	const [isPending, startTransition] = useTransition()
	const form = useForm({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			content: "",
			image: undefined,
		},
	});

	function onSubmit(values: z.infer<typeof postSchema>) {
		startTransition(async () => {
			await createBlogAction(values);
		})
	}



	return (
		<div className="py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Create Post
				</h1>
				<p className="text-xl text-muted-foreground pt-4">
					Share your thoughts with the world
				</p>
			</div>
			<Card className="w-full max-w-xl mx-auto ">
				<CardHeader>
					<CardTitle>Create Blog Article</CardTitle>
					<CardDescription>
						Create a new blog article to share with the world
					</CardDescription>
					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FieldGroup className="gap-y-4">
								<Controller
									name="title"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Title</FieldLabel>
											<Input
												aria-invalid={fieldState.invalid}
												type="text"
												placeholder="Enter title"
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									name="content"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Content</FieldLabel>
											<Textarea
												aria-invalid={fieldState.invalid}
												placeholder="Enter content"
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									name="image"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Image</FieldLabel>
											<Input
												aria-invalid={fieldState.invalid}
												placeholder="Enter content"
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0]
													field.onChange(file)
												}}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Button disabled={isPending} type="submit" className="w-full">

									{
										isPending ? (
											<>
												<Loader2 />
											</>
										) : "Create post"
									}
								</Button>
							</FieldGroup>
						</form>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
}
