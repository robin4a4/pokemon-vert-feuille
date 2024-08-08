import { queryOptions } from "@tanstack/react-query";
import type { Grid, User } from "./types";
import { fetchApi } from "./utils";

export const userQueries = {
	me: () =>
		queryOptions({
			queryKey: ["users", "me"],
			queryFn: async () => fetchApi<User>("/users/me"),
		}),
};

export const gridQueries = {
	list: () =>
		queryOptions({
			queryKey: ["grids"],
			queryFn: async () => fetchApi<Grid[]>("/grids"),
		}),
	detail: (id: string) =>
		queryOptions({
			queryKey: ["grids", id],
			queryFn: async () => fetchApi<Grid>(`/grids/${id}`),
		}),
};
