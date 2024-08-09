import crypto from "node:crypto";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../models";
import { UserBodySchema } from "../schema";
import { Logger, generateToken, strategyOptions } from "../utils";
import { validateResponse } from "./validator";

const authRouter = Router();
const logger = new Logger("authRouter");

passport.use(
	new JwtStrategy(strategyOptions, (jwtPayload, done) => {
		User.query()
			.findById(jwtPayload.id)
			.then((user) => {
				if (!user) {
					return done(null, false, { message: "Incorrect username or password." });
				}
				return done(null, user);
			});
	}),
);

authRouter.post("/login", (req, res, next) => {
	logger.info("Logging in");
	try {
		const { username, password } = UserBodySchema.parse({
			username: req.body.username,
			password: req.body.password,
		});
        console.log(username, password);
		User.query()
			.findOne({ username })
			.then((user) => {
				if (!user) {
					logger.warn("User not found");
					return res
						.status(StatusCodes.NOT_FOUND)
						.json(validateResponse({ status: "error", error: "User not found, did you forgot to register ?" }));
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
						res.json({ status: "success", data: token });
					} else {
						logger.error("Passwords do not match");
						res.status(StatusCodes.UNAUTHORIZED).json(validateResponse({ status: "error", error: "Invalid username or password" }));
					}
				});
			});
	} catch (err) {
		logger.error("Error logging in");
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validateResponse({ status: "error", error: err.toString() }));
	}
});

export { authRouter };
