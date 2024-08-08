import type { NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import type { User } from "./models";
import { ExtractJwt, type StrategyOptionsWithRequest } from "passport-jwt";


export class Logger {
    logger_name: string;
    constructor(logger_name: string) {
        this.logger_name = logger_name;
    }
    info(message: string) {
        console.log(`[INFO] ${this.logger_name}: ${message}`);
    }
    error(message: string) {
        console.error(`[ERROR] ${this.logger_name}: ${message}`);
    }
    warn(message: string) {
        console.warn(`[WARN] ${this.logger_name}: ${message}`);
    }
}

export const strategy_options = {
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
