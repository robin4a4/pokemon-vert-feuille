import crypto from "node:crypto";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptions } from "passport-jwt";
import { TokenSchema } from "shared/schema";
import { validateErrorResponse, validateSuccessResponse } from "shared/validator";
import { User } from "../models/user";
import { UserBodySchema } from "../schema";
import { Logger, generateToken } from "../utils";

const authRouter = Router();
const logger = new Logger("authRouter");

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: __SECRET_TOKEN__,
		},
		(jwtPayload, done) => {
			User.query()
				.findById(jwtPayload.id)
				.then((user) => {
					if (!user) {
						return done(null, false, { message: "Incorrect username or password." });
					}
					return done(null, user);
				});
		},
	),
);

authRouter.post("/login", (req, res, next) => {
	logger.info("Logging in");
	try {
		const { username, password } = UserBodySchema.parse({
			username: req.body.username,
			password: req.body.password,
		});
		User.query()
			.findOne({ username })
			.then((user) => {
				if (!user) {
					logger.warn("User not found");
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(validateErrorResponse({ status: "error", error: "User not found, did you forgot to register ?" }));
				}

				// Retrieve the stored salt and hashed password from the user record
				const { salt, password: storedHashedPassword } = user;
				const bufferSalt = Buffer.from(salt, "hex");
				const bufferStoredPassword = Buffer.from(storedHashedPassword, "hex");
				// Hash the provided password with the same salt
				crypto.pbkdf2(password, bufferSalt, 310000, 32, "sha256", (err, hashedPassword) => {
					if (err) {
						logger.error("Error hashing password");
						return next(err);
					}
					// Compare the hashed passwords
					if (crypto.timingSafeEqual(hashedPassword, bufferStoredPassword)) {
						logger.info("Passwords match");
						const token = generateToken(user);
						res.json(validateSuccessResponse({ status: "success", data: { token } }, TokenSchema));
					} else {
						logger.error("Passwords do not match");
						res.status(StatusCodes.UNAUTHORIZED).json(validateErrorResponse({ status: "error", error: "Invalid username or password" }));
					}
				});
			});
	} catch (err) {
		logger.error("Error logging in");
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateErrorResponse({ status: "error", error: (err as Error).message }));
	}
});

export { authRouter };
