import z from "zod";

export const ApiSuccessSchema = z.object({
	status: z.literal("success"),
});

export const ApiErrorSchema = z.object({
    status: z.literal("error"),
    error: z.string(),
});

export const UserDataSchema = z.object({
    id: z.number(),
    username: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})
export const UserSchema = ApiSuccessSchema.extend({data: UserDataSchema});
export const UsersSchema = ApiSuccessSchema.extend({data: z.array(UserDataSchema)});

export const TokenSchema = ApiSuccessSchema.extend({data: z.object({
    token: z.string(),
})});

export const GridDataSchema = z.object({
    id: z.number(),
    name: z.string(),
    grid: z.string(),
    userId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const GridSchema = ApiSuccessSchema.extend({data: GridDataSchema});
export const GridsSchema = ApiSuccessSchema.extend({data: z.array(GridDataSchema)});
