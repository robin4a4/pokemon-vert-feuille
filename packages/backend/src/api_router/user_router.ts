import crypto from "node:crypto";
import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { PartialModelObject } from "objection";
import { User } from "../models";
import { UserBodySchema, UserParamsSchema } from "../schema";
import { Logger, generateToken, isUniqueConstraintViolation } from "../utils";
import { validateResponse } from "./validator";

const userRouter = Router();

const logger = new Logger("userRouter");

userRouter
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const users = await User.query();
			logger.info("Users found");
			res.json(validateResponse({ status: "success", data: users }));
		} catch (e) {
			logger.error("Error getting users");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateResponse({
					status: "error",
					error: (e as any).errors.toString(),
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
					res.json(validateResponse({ status: "success", data: { user, token } }));
				})
				.catch((err) => {
                    if (isUniqueConstraintViolation(err)) {
                        logger.warn("Username already exists");
                        // Handle duplicate entry (unique constraint violation)
                        res.status(StatusCodes.CONFLICT).json(validateResponse({ status: "error", error: "Username already exists" }));
                    } else {
                        logger.error("Error creating user");
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateResponse({ status: "error", error: err.toString() }));
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
				res.status(StatusCodes.NOT_FOUND).json(validateResponse({ status: "error", error: "User not found" }));
				return;
			}
			logger.info("User found");
			res.json(validateResponse({ status: "success", data: user }));
		} catch (e) {
			logger.error("Error getting user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateResponse({
					status: "error",
					error: (e as any).errors.toString(),
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
						res.json(validateResponse({ status: "success", data: user }));
					})
					.catch((err) => {
						logger.error("Error updating user in db");
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateResponse({ status: "error", error: err.toString() }));
					});
			});
		} catch (e) {
			logger.error("Error updating user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validateResponse({
					status: "error",
					error: (e as any).errors.toString(),
				}),
			);
		}
	});

export { userRouter };
