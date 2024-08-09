import { ApiSuccessSchema, ApiErrorSchema } from "shared/schema";
import type { ZodError, z } from "zod";
import { Logger } from "../../backend/src/utils";

const logger = new Logger("validator");

export function validateSuccessResponse<TPayloadSchema extends z.ZodType<any, any>>(payload: z.infer<TPayloadSchema>, payloadSchema: TPayloadSchema) {
	try {
		return payloadSchema.parse(payload);
	} catch (e) {
		logger.error(`Error validating response: ${e}`);
		return {
			status: "error",
			error: JSON.stringify((e as ZodError).errors),
		} satisfies z.infer<typeof ApiErrorSchema>;
	}
}

export function validateErrorResponse(payload: z.infer<typeof ApiErrorSchema>) {
    try {
        return ApiErrorSchema.parse(payload);
    } catch (e) {
        logger.error(`Error validating response: ${e}`);
        return {
            status: "error",
            error: JSON.stringify((e as ZodError).errors),
        } satisfies z.infer<typeof ApiErrorSchema>;
    }
}
