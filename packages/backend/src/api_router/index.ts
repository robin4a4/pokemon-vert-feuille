import { Router } from "express";
import { auth_router } from "./auth_router";
import { grid_router } from "./grid_router";
import { user_router } from "./user_router";

const api_router = Router();

api_router.use("/grids", grid_router);
api_router.use("/users", user_router);
api_router.use("/auth", auth_router);

export { api_router };
