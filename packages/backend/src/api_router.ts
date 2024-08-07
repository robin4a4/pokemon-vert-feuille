import { type NextFunction, Router, type Request, type Response } from "express";
import crypto from 'crypto'
import { User } from "./models";
import type { PartialModelObject } from "objection";
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const api_router = Router();

const ApiResponseSchema = z.object({
    status: z.literal('success').or(z.literal('error')),
    data: z.any().optional(),
    error: z.string().optional(),
});

function validate_response(data: z.infer<typeof ApiResponseSchema>) {
    try {
        return ApiResponseSchema.parse(data);
    } catch (e) {
        return { status: "error", error: (e as ZodError).errors.toString() } satisfies z.infer<typeof ApiResponseSchema>;
    }
}

const UserParamsSchema = z.object({
    id: z.string(),
}).transform((params) => {
    return { id: parseInt(params.id) };
});

const UserBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

api_router.get("/grid", (req: Request, res: Response) => {
    res.send("grid");
});

api_router.get("/user/:id", (req: Request, res: Response) => {
    try {
        const user_id = UserParamsSchema.parse(req.params).id;
        const user = User.query().findById(user_id);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json(validate_response({status: "error", error: "User not found" }));
            return;
        }
        // res.json(validate_response(user));
    } catch (e) {
        res.status(400).json(validate_response({ status: "error", error: (e as any).errors.toString() }));
    }
})

api_router.post("/user", (req: Request, res: Response, next: any) => {
    const { username, password } = UserBodySchema.parse(req.body);
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }
        User.query().insert({
            username,
            password: hashedPassword,
            salt: salt
        } as unknown as PartialModelObject<User>).then((user) => {
            res.send(user);
        }).catch((err) => {
            next(err);
        }
    )});
})
