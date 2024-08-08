import ConnectSQLite3 from "connect-sqlite3";
import express from "express";
import session from "express-session";
import { Model } from "objection";
import passport from "passport";
import knexfile from "../knexfile";
import { api_router } from "./api_router";
import { auth_router } from "./auth_router";

Model.knex(knexfile);

const app = express();
const port = 3000;
const BASE_PATH = "/api";

const SQLiteStore = ConnectSQLite3(session);
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: new SQLiteStore({ db: "sessions.db", dir: "../" }),
	}),
);
app.use(passport.authenticate("session"));

app.use(BASE_PATH, api_router);
app.use(BASE_PATH, auth_router);

app.listen(port, () => {
	console.log(`Server for map builder listening on port ${port}`);
});

export const viteNodeApp = app;
