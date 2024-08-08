import { z } from "zod";

export const UserParamsSchema = z
	.object({
		id: z.string(),
	})
	.transform((params) => {
		return { id: Number.parseInt(params.id) };
	});

export const UserBodySchema = z.object({
	username: z.string(),
	password: z.string(),
});
