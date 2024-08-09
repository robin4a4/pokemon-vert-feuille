import crypto from "node:crypto";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../models";
import { UserBodySchema } from "../schema";
import { Logger, generate_token, strategy_options } from "../utils";
import { validate_response } from "./validator";

const auth_router = Router();
const logger = new Logger("auth_router");

passport.use(
	new JwtStrategy(strategy_options, (jwt_payload, done) => {
		User.query()
			.findById(jwt_payload.id)
			.then((user) => {
				if (!user) {
					return done(null, false, { message: "Incorrect username or password." });
				}
				return done(null, user);
			});
	}),
);

auth_router.post("/login", (req, res, next) => {
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
						.json(validate_response({ status: "error", error: "User not found, did you forgot to register ?" }));
				}

				// Retrieve the stored salt and hashed password from the user record
				const { salt, password: stored_hashed_password } = user;
                const buffer_salt = Buffer.from(salt, "hex");
                const buffer_stored_password = Buffer.from(stored_hashed_password, "hex");
				// Hash the provided password with the same salt
				crypto.pbkdf2(password, buffer_salt, 310000, 32, "sha256", (err, hashed_password) => {
					if (err) {
						logger.error("Error hashing password");
						return next(err);
					}
					// Compare the hashed passwords
					if (crypto.timingSafeEqual(hashed_password, buffer_stored_password)) {
						logger.info("Passwords match");
						const token = generate_token(user);
						res.json({ status: "success", data: token });
					} else {
						logger.error("Passwords do not match");
						res.status(StatusCodes.UNAUTHORIZED).json(validate_response({ status: "error", error: "Invalid username or password" }));
					}
				});
			});
	} catch (err) {
		logger.error("Error logging in");
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validate_response({ status: "error", error: err.toString() }));
	}
});

export { auth_router };
