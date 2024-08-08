import { Router, type NextFunction } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, type StrategyOptionsWithRequest} from "passport-jwt";
import { User } from "../models";
import { Logger } from "../utils";
import { validate_response } from "./validator";
import jwt from "jsonwebtoken";
import { UserBodySchema } from "../schema";
import crypto from "node:crypto";
import { StatusCodes } from "http-status-codes";

const auth_router = Router();
const logger = new Logger("auth_router");

const strategy_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret", // replace with process.env.JWT_SECRET
    passReqToCallback: true,
} satisfies StrategyOptionsWithRequest

export function generateToken(user: User) {
    return jwt.sign({ id: user.id }, strategy_options.secretOrKey, { expiresIn: '1h' });
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false })(req, res, next);
}

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

auth_router.post(
	"/login",
    (req, res, next) => {
        logger.info("Logging in");
        try {
            console.log(req.body);
            const { username, password } = UserBodySchema.parse({
                username: req.body.username,
                password: req.body.password,
            });
            User.query().findOne({ username })
            .then((user) => {
                if (!user) {
                    logger.warn("User not found");
                    return res.status(StatusCodes.NOT_FOUND).json(validate_response({ status: 'error', error: 'User not found, did you forgot to register ?' }));
                }

                // Retrieve the stored salt and hashed password from the user record
                const { salt, password: stored_hashed_password } = user;

                // Hash the provided password with the same salt
                crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashed_password) => {
                    if (err) {
                        logger.error("Error hashing password");
                        return next(err);
                    }

                    // Compare the hashed passwords
                    if (crypto.timingSafeEqual(hashed_password, Buffer.from(stored_hashed_password, "hex"))) {
                        logger.info("Passwords match");
                        const token = generateToken(user);
                        res.json({ status: 'success', data: token });
                    } else {
                        logger.error("Passwords do not match");
                        res.status(StatusCodes.UNAUTHORIZED).json(validate_response({ status: 'error', error: 'Invalid username or password' }));
                    }
                });
            })
        }
        catch (err) {
            logger.error("Error logging in");
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(validate_response({ status: 'error', error: err.toString() }));
        }
    },
);

auth_router.get("/logout", (req, res) => {
    logger.info("Logging out");
	// req.logout();
	res.redirect("/");
});

export { auth_router };
