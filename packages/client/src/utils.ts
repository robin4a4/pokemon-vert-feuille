import { ApiResponseSchema } from "shared/schema";

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


export async function fetchApi(path: string, options: RequestInit = {}) {
    const response = await fetch(combineUrl(import.meta.env.VITE_BASE_API_URL, path), {
    credentials: "include",
    ...options,
  })
  try {
    const parsedResponse = ApiResponseSchema.parse(await response.json())
    if (!response.ok) {
        if (parsedResponse.status === "error") {
            throw new Error(parsedResponse.error);
        }
        throw new Error("An incorrect response was received from the server and passed the schema validation");
    }
    return parsedResponse.data
    } catch (e) {
        throw new Error(e as any);
    }
}
