import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Anchor, Button, Frame, TextInput } from "react95";
import { ApiResponseSchema } from "shared/schema";
import { fetchApi } from "../utils";
import { AppRoute } from "../consts";

export function LoginForm({
    type,
}: {
    type: "login" | "signup";
}) {
    const navigate = useNavigate();
	const loginMutation = useMutation({
		mutationFn: async (formData: FormData) => {
            if (type === "signup") {
                const password = formData.get("password") as string;
                const confirmPassword = formData.get("confirm-password") as string;
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
            }
            const apiPath = type === "login" ? "/auth/login" : "/users";
            const response = await fetchApi(apiPath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.get("username") as string,
                    password: formData.get("password") as string,
                })
            });
            const result = ApiResponseSchema.parse(await response.json())
            if (result.status === "error") {
                throw new Error(result.error)
            }
            return result.data
		},
        onSuccess: (data) => {
            localStorage.setItem("registration-token", data as string);
            navigate(AppRoute.MAP_BUILDER);
        },
        onError: () => {
            localStorage.removeItem("registration-token");
        }
	});

	return (
		<Frame
			variant="window"
			shadow
			style={{ padding: "16px", lineHeight: "1.5", width: 600, margin: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}
		>
			<h1 style={{fontSize: 24}}>
                {type === "login" ? "Login" : "Signup"}
            </h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					loginMutation.mutate(formData);
				}}
                className="flex flex-col gap-4"
			>
                <label>
                    <span>Username</span>
					<TextInput name="username" placeholder="jean-michel" fullWidth />
				</label>
				<label>
                    <span>Password</span>
					<TextInput name="password" type="password" fullWidth />
				</label>
                {type === "signup" && (
                    <label>
                      <span>Confirm password</span>
					<TextInput name="confirm-password" type="password" fullWidth />
				</label>
                )}
                {loginMutation.status === "error" && <p className="text-red-500">
                    {loginMutation.error instanceof Error ? loginMutation.error.message : "An error occurred"}
                    </p>}
				<Button type="submit">
                    {type === "login" ? "Login" : "Signup"}{loginMutation.status === "pending" && "..."}
                </Button>
                {type === "login" ? (
                <div className="text-center">
                    Do not have an account? <Anchor
                    href="/signup"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/signup");
                    }}
                    className="text-blue-500">
                        Sign up
                    </Anchor>
                </div>
                ) : (
                <div className="text-center">
                    Already have an account? <Anchor
                    href="/login"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                    }}
                    className="text-blue-500">
                        Login
                    </Anchor>
                </div>)}
			</form>
		</Frame>
	);
}
