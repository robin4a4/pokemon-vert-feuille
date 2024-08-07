import { type Request, type Response, Router } from "express";
import { user_router } from "./user_router";

const api_router = Router();

api_router.get("/grid", (req: Request, res: Response) => {
	res.send("grid");
});

api_router.use("/users", user_router);

export { api_router };
