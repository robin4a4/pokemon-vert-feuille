import type { User } from "./models";

export interface AuthenticatedRequest extends Request {
    user?: User;
}
