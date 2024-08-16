import crypto from "node:crypto";
import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { TokenSchema, UserSchema, UsersSchema } from "shared/schema";
import { validateErrorResponse, validateSuccessResponse } from "shared/validator";
import { z } from "zod";
import { User } from "../models/user";
import { UserBodySchema, UserParamsSchema } from "../schema";
import { Logger, generateToken, isUniqueConstraintViolation } from "../utils";

const userRouter = Router();

const logger = new Logger("userRouter");

userRouter
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const users = await User.query();
			logger.info("Users found");
			res.json(
				validateSuccessResponse(
					{
						status: "success",
						data: users.map((user) => {
							return {
								id: user.id,
								username: user.username,
								createdAt: user.created_at,
								updatedAt: user.updated_at,
							};
						}),
					},
					UsersSchema,
				),
			);
		} catch (e) {
			logger.error("Error getting users");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateErrorResponse({
					status: "error",
					error: (e as Error).message,
				}),
			);
		}
	})
	.post((req: Request, res: Response, next: NextFunction) => {
		const { username, password } = UserBodySchema.parse(req.body);
		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
			if (err) {
				return next(err);
			}
			User.query()
				.insert({
					username,
					password: hashedPassword.toString("hex"),
					salt: salt.toString("hex"),
				} as unknown as PartialModelObject<User>)
				.then((user) => {
					logger.info("User created");
					// Generate a JWT token for the newly registered user
					const token = generateToken(user);
					res.json(validateSuccessResponse({ status: "success", data: { token } }, TokenSchema));
				})
				.catch((err) => {
					if (isUniqueConstraintViolation(err)) {
						logger.warn("Username already exists");
						// Handle duplicate entry (unique constraint violation)
						res.status(StatusCodes.CONFLICT).json(validateErrorResponse({ status: "error", error: "Username already exists" }));
					} else {
						logger.error("Error creating user");
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateErrorResponse({ status: "error", error: err.toString() }));
					}
				});
		});
	});

userRouter
	.route("/:id")
	.get(async (req: Request, res: Response) => {
		try {
			const userId = UserParamsSchema.parse(req.params).id;
			const user = await User.query().findById(userId);
			if (!user) {
				logger.error("User not found");
				res.status(StatusCodes.NOT_FOUND).json(validateErrorResponse({ status: "error", error: "User not found" }));
				return;
			}
			logger.info("User found");
			res.json(
				validateSuccessResponse(
					{
						status: "success",
						data: {
							id: user.id,
							username: user.username,
							createdAt: user.created_at,
							updatedAt: user.updated_at,
						},
					},
					UserSchema,
				),
			);
		} catch (e) {
			logger.error("Error getting user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateErrorResponse({
					status: "error",
					error: (e as Error).message,
				}),
			);
		}
	})
	.put(async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = UserParamsSchema.parse(req.params).id;
			const { username, password } = UserBodySchema.parse(req.body);
			const salt = crypto.randomBytes(16);
			crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
				if (err) {
					return next(err);
				}
				User.query()
					.findById(userId)
					.patch({
						username,
						password: hashedPassword,
						salt: salt,
					} as unknown as PartialModelObject<User>)
					.then((user) => {
						logger.info("User updated");
						res.json(validateSuccessResponse({ status: "success", data: {} }, z.object({})));
					})
					.catch((err) => {
						logger.error("Error updating user in db");
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateErrorResponse({ status: "error", error: err.toString() }));
					});
			});
		} catch (e) {
			logger.error("Error updating user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateErrorResponse({
					status: "error",
					error: (e as Error).message,
				}),
			);
		}
	});

export { userRouter };
