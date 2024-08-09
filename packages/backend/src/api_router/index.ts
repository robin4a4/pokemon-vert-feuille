import { Router } from "express";
import { authRouter } from "./auth_router";
import { gridRouter } from "./grid_router";
import { userRouter } from "./user_router";

const apiRouter = Router();

apiRouter.use("/grids", gridRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);

export { apiRouter };
