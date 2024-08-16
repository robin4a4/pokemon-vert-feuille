import type { User } from "./models/user";

declare module "express-serve-static-core" {
	interface Request {
		user?: User; // Replace `User` with the correct type of your user object
	}
}
