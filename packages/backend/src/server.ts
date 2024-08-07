import express from "express";
import { Model } from "objection";
import knexfile from "../knexfile";
import { auth_router } from "./auth_router";
import { api_router } from "./api_router";

Model.knex(knexfile);

const app = express();
const port = 3000;
const BASE_PATH = "/api"

app.use(BASE_PATH, api_router);
app.use(BASE_PATH, auth_router);

app.listen(port, () => {
  console.log(`Server for map builder listening on port ${port}`);
});

export const viteNodeApp = app;
