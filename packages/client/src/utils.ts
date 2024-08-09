import { ApiErrorSchema, type ApiSuccessSchema } from "shared/schema";
import type { z } from "zod";
import { AUTH_TOKEN_KEY } from "./consts";

export function combineUrl(path1: string, path2: string) {
	let firstPath = path1;
	let secondPath = path2;
	if (path1.endsWith("/")) {
		firstPath = path1.substring(0, path1.length - 1);
	}
	if (path2.startsWith("/")) {
		secondPath = path2.substring(1);
	}
	return `${firstPath}/${secondPath}`;
}

export async function fetchApi<TSchema extends typeof ApiSuccessSchema>(path: string, schema: TSchema, options?: RequestInit) {
	const response = await fetch(
		combineUrl(import.meta.env.VITE_BASE_API_URL, path),
		{
			credentials: "include",
			...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
                ...options?.headers,
            },
		},
	);

    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = "/login";
        }
        try {
            const parsedResponse = ApiErrorSchema.parse(await response.json());
            if (parsedResponse.status === "error") {
                throw new Error(parsedResponse.error);
            }
            throw new Error(
                "An incorrect response was received from the server and passed the schema validation",
            );
        } catch (e) {
            throw new Error(e as any);
        }
    }

	try {
		const parsedResponse = schema.parse(await response.json());
        if ("data" in parsedResponse)
            //@ts-expect-error: TODO: find a way to add data to ApiSuccessSchema without breaking the rest of the code
		    return parsedResponse.data as z.infer<TSchema>["data"];
        throw new Error("Data not found in response");
	} catch (e) {
		throw new Error(e as any);
	}
}
