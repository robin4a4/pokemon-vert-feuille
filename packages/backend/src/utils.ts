import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, type StrategyOptions, type StrategyOptionsWithRequest } from "passport-jwt";
import type { User } from "./models";
import { StatusCodes } from "http-status-codes";
import type { AuthenticatedRequest } from "./types";

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

export function generateToken(user: User) {
    if (!user.id) {
        throw new Error("User ID is missing when generating token");
    }
	return jwt.sign({ id: user.id }, __SECRET_TOKEN__, { expiresIn: "1h" });
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
	passport.authenticate("jwt", { session: false })(req, res, next);
}

export const isUniqueConstraintViolation = (error: unknown) => error instanceof Error && error.name === "UniqueViolationError";
