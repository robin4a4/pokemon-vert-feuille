import { queryOptions } from "@tanstack/react-query";
import { fetchApi } from "./utils";

export const mapBuilderQueries = {
    detail: (id: string) => queryOptions({
        queryKey: ["grid"],
        queryFn: async () => {
            const response = await fetchApi(`/grids/${id}`);
            const result = response.json();
            if (result.status === "error") {
                throw new Error(result.error);
            }
        },
    }),
}
