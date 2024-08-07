import { type ZodError, z } from "zod";


export const ApiResponseSchema = z.object({
	status: z.literal("success").or(z.literal("error")),
	data: z.any().optional(),
	error: z.string().optional(),
});

export function validate_response(data: z.infer<typeof ApiResponseSchema>) {
	try {
		return ApiResponseSchema.parse(data);
	} catch (e) {
		return {
			status: "error",
			error: (e as ZodError).errors.toString(),
		} satisfies z.infer<typeof ApiResponseSchema>;
	}
}
