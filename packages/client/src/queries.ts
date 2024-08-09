import { queryOptions } from "@tanstack/react-query";
import { fetchApi } from "./utils";
import { GridSchema, GridsSchema, UserSchema } from "shared/schema";

export const userQueries = {
	me: () =>
		queryOptions({
			queryKey: ["users", "me"],
			queryFn: async () => fetchApi("/users/me", UserSchema),
		}),
};

export const gridQueries = {
	list: () =>
		queryOptions({
			queryKey: ["grids"],
			queryFn: () => fetchApi("/grids", GridsSchema),
		}),
	detail: (id: string) =>
		queryOptions({
			queryKey: ["grids", id],
			queryFn: async () => fetchApi(`/grids/${id}`, GridSchema),
		}),
};
