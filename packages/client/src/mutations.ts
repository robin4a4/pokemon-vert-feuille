import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "./utils";
import { AppRoute, AUTH_TOKEN_KEY } from "./consts";
import { useNavigate } from "react-router-dom";
import { TokenSchema, GridSchema } from "shared/schema";
import { Grid } from "./types";

export function useLoginMutation(type: "signup" | "login") {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            if (type === "signup") {
                const password = formData.get("password") as string;
                const confirmPassword = formData.get("confirm-password") as string;
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
            }
            const apiPath = type === "login" ? "/auth/login" : "/users";
            return fetchApi(apiPath, TokenSchema, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.get("username") as string,
                    password: formData.get("password") as string,
                }),
            });
        },
        onSuccess: (data) => {
             if (data) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                navigate(AppRoute.DASHBOARD);
            }
        },
        onError: () => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        },
    })
} ;

export function useLogoutMutation() {
    const navigate = useNavigate();
    return {
        mutate: () => {
            console.log("Logging out");
            localStorage.removeItem(AUTH_TOKEN_KEY);
            navigate(AppRoute.LOGIN);
    }
}
}

export function useGridMutation() {
    return useMutation({
        mutationFn: async (grid: Omit<Grid, "id">) => {
            return fetchApi("/grids", GridSchema, {
                method: "POST",
                body: JSON.stringify(grid),
            });
        },
    });
}
