import { UserInterface } from "@/models/User.ts";


declare global {
    namespace Express {
        interface Request {
            user: UserInterface;
        }
    }
}