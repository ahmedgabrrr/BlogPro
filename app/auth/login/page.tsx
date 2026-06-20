"use client";
import { loginSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
// import { useRouter } from "next/dist/client/components/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
	const [isPending, startTransition] = useTransition();

	// const router = useRouter();
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	async function onSubmit(data: z.infer<typeof loginSchema>) {

		startTransition(async () => {
			await authClient.signIn.email({
				email: data.email,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Logged in successfully")
						window.location.href = "/blog";

					},
					onError: (error) => {
						toast.error(error.error.message)
					}
				}
			});
		})
	}

	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription
				>Login to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FieldGroup>
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
						<Button disabled={isPending}>{isPending ? (
							<>
								<Loader2 className="animate-spin size-4" />
							</>
						) : "Login"}</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}