import z from "zod";

export const postSchema = z.object({
	title: z.string().min(3, "Title is required").max(50, "Title must be less than 50 characters"),
	content: z.string().min(10, "Content is required").max(5000, "Content must be less than 5000 characters"),
	image: z.instanceof(File, { message: "Image is required" })
});	