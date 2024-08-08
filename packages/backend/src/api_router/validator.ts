import type { ZodError, z } from "zod";
import { ApiResponseSchema } from "shared/schema";

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
