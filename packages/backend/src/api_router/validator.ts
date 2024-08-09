import { ApiResponseSchema } from "shared/schema";
import type { ZodError, z } from "zod";
import { Logger } from "../utils";

const logger = new Logger("validator");

export function validateResponse(data: z.infer<typeof ApiResponseSchema>) {
	try {
		return ApiResponseSchema.parse(data);
	} catch (e) {
		logger.error("Error validating response", e);
		return {
			status: "error",
			error: JSON.stringify((e as ZodError).errors),
		} satisfies z.infer<typeof ApiResponseSchema>;
	}
}
