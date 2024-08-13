import type { z } from 'zod';
import type { GridSchema } from 'shared/schema';

export type Grid = z.infer<typeof GridSchema>["data"];

export type User = {
	id: number;
	username: string;
};
