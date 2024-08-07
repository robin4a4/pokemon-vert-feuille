import { Router, type Request, type Response } from "express";
import z from 'zod'

export const api_router = Router();

api_router.get("/grid", (req: Request, res: Response) => {
    res.send("grid");
});

const userUrlParams = z.object({
    id: z.string(),
}).transform((params) => {
    return { id: parseInt(params.id) };
});

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
});

api_router.get("/user/:id", (req: Request, res: Response) => {
    const user_id = userUrlParams.parse(req.params).id;
    console.log(typeof user_id);
    res.send(`user ${user_id}`);
})

api_router.post("/user", (req: Request, res: Response) => {
    const { username, password } = userSchema.parse(req.body);
})
