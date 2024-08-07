import crypto from "crypto";
import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { type ZodError, z } from "zod";
import { User } from "../models";
import { validate_response } from "./validator";

const user_router = Router();

const UserParamsSchema = z
	.object({
		id: z.string(),
	})
	.transform((params) => {
		return { id: Number.parseInt(params.id) };
	});

const UserBodySchema = z.object({
	username: z.string(),
	password: z.string(),
});

user_router
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const users = await User.query();
			res.json(validate_response({ status: "success", data: users }));
		} catch (e) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validate_response({
					status: "error",
					error: (e as any).errors.toString(),
				}),
			);
		}
	})
	.post((req: Request, res: Response, next: NextFunction) => {
		const { username, password } = UserBodySchema.parse(req.body);
		var salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
			if (err) {
				return next(err);
			}
			User.query()
				.insert({
					username,
					password: hashedPassword,
					salt: salt,
				} as unknown as PartialModelObject<User>)
				.then((user) => {
					res.json(validate_response({ status: "success", data: user }));
				})
				.catch((err) => {
					res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validate_response({ status: "error", error: err.toString() }));
				});
		});
	});

user_router
	.route("/:id")
	.get(async (req: Request, res: Response) => {
		try {
			const user_id = UserParamsSchema.parse(req.params).id;
			const user = await User.query().findById(user_id);
			if (!user) {
				res.status(StatusCodes.NOT_FOUND).json(validate_response({ status: "error", error: "User not found" }));
				return;
			}
			res.json(validate_response({ status: "success", data: user }));
		} catch (e) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validate_response({
					status: "error",
					error: (e as any).errors.toString(),
				}),
			);
		}
	})
	.put(async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user_id = UserParamsSchema.parse(req.params).id;
			const { username, password } = UserBodySchema.parse(req.body);
			var salt = crypto.randomBytes(16);
			crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
				if (err) {
					return next(err);
				}
				User.query()
					.findById(user_id)
					.patch({
						username,
						password: hashedPassword,
						salt: salt,
					} as unknown as PartialModelObject<User>)
					.then((user) => {
						res.json(validate_response({ status: "success", data: user }));
					})
					.catch((err) => {
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validate_response({ status: "error", error: err.toString() }));
					});
			});
		} catch (e) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validate_response({
					status: "error",
					error: (e as any).errors.toString(),
				}),
			);
		}
	});

export { user_router };
