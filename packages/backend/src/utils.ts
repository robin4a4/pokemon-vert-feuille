import type { NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, type StrategyOptionsWithRequest } from "passport-jwt";
import type { User } from "./models";

export class Logger {
	loggerName: string;
	constructor(loggerName: string) {
		this.loggerName = loggerName;
	}
	info(message: string) {
		console.log(`[INFO] ${this.loggerName}: ${message}`);
	}
	error(message: string) {
		console.error(`[ERROR] ${this.loggerName}: ${message}`);
	}
	warn(message: string) {
		console.warn(`[WARN] ${this.loggerName}: ${message}`);
	}
}

export const strategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: "secret", // replace with process.env.JWT_SECRET
	passReqToCallback: true,
} satisfies StrategyOptionsWithRequest;

export function generateToken(user: User) {
	return jwt.sign({ id: user.id }, strategyOptions.secretOrKey, { expiresIn: "1h" });
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
	passport.authenticate("jwt", { session: false })(req, res, next);
}

export const isUniqueConstraintViolation = (error: unknown) => error instanceof Error && error.name === "UniqueViolationError";
