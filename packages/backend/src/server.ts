import cors from "cors";
import express, { type NextFunction } from "express";
import { Model } from "objection";
import passport from "passport";
import knexfile from "../knexfile";
import { apiRouter } from "./api_router";

Model.knex(knexfile);

const app = express();
const port = process.env.PORT ?? 3000;
const BASE_PATH = "/api";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.url}`);
	next();
};

// Middleware to parse application/json
app.use(express.json());

// @ts-ignore
app.use(loggerMiddleware);

app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5173", "https://pokemon.marillia.io"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);
app.use(passport.initialize());
app.options("*", cors());
app.use(BASE_PATH, apiRouter);

if (process.env.NODE_ENV === "production") {
	app.listen(port, () => {
		console.log(`Server for map builder listening on port ${port}`);
	});
}

export const viteNodeApp = app;
