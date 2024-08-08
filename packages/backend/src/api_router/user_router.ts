import { type NextFunction, type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import crypto from "node:crypto";
import type { PartialModelObject } from "objection";
import { User } from "../models";
import { UserBodySchema, UserParamsSchema } from "../schema";
import { generateToken, Logger } from "../utils";
import { validate_response } from "./validator";

const user_router = Router();

const logger = new Logger("user_router");

user_router
	.route("/")
	.get(async (req: Request, res: Response) => {
		try {
			const users = await User.query();
            logger.info("Users found");
			res.json(validate_response({ status: "success", data: users }));
		} catch (e) {
            logger.error("Error getting users");
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
					res.json(validate_response({ status: "success", data: {user, token}}));
				})
				.catch((err) => {
                    logger.error("Error creating user");
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
                logger.error("User not found");
				res.status(StatusCodes.NOT_FOUND).json(validate_response({ status: "error", error: "User not found" }));
				return;
			}
            logger.info("User found");
			res.json(validate_response({ status: "success", data: user }));
		} catch (e) {
            logger.error("Error getting user");
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
			const salt = crypto.randomBytes(16);
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
                        logger.info("User updated");
						res.json(validate_response({ status: "success", data: user }));
					})
					.catch((err) => {
                        logger.error("Error updating user in db");
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validate_response({ status: "error", error: err.toString() }));
					});
			});
		} catch (e) {
            logger.error("Error updating user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
				validate_response({
					status: "error",
					error: (e as any).errors.toString(),
				}),
			);
		}
	});

export { user_router };
