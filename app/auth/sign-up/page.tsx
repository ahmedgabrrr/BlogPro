"use client";
import { SignUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof SignUpSchema>) {
		startTransition(async () => {
			await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Account created successfully");
						window.location.href = "/blog";
					},
					onError: (error) => {
						toast.error(error.error.message || "Something went wrong");
					}
				}
			});
		});
	}

	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create an account to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FieldGroup>
						<Controller name="name" control={form.control} render={({ field, fieldState }) => <Field>
							<FieldLabel>Name</FieldLabel>
							<Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>} />
						<Controller name="email" control={form.control} render={({ field, fieldState }) => <Field>
							<FieldLabel>Email</FieldLabel>
							<Input aria-invalid={fieldState.invalid} placeholder="john.doe@example.com" {...field} />
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>} />
						<Controller name="password" control={form.control} render={({ field, fieldState }) => <Field>
							<FieldLabel>Password</FieldLabel>
							<Input aria-invalid={fieldState.invalid} type="password" placeholder="******" {...field} />
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>} />
						<Button type="submit" disabled={isPending}>{isPending ? (
							<>
								<Loader2 className="animate-spin size-4" />
							</>
						) : "Sign Up"}</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}