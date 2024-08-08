import z from "zod";

export const ApiResponseSchema = z.object({
	status: z.literal("success").or(z.literal("error")),
	data: z.any().optional(),
	error: z.string().optional(),
});
