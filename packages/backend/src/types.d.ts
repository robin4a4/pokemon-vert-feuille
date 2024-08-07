import * as Express from "express";
import type { z } from "zod";

declare module "Express" {
	interface Response {
		json<TData>(data: TData, schema?: z.ZodType<TData, any>): this;
	}
}
