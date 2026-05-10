import User from "@/models/User.js";
import { AppError } from "@/utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";

export const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Please log in to continue!", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    const currentUser = await User.findOne({ _id: decoded.id });

    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    req.user = currentUser;
    next();
  },
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You are unauthorized to perform this action!", 403);
    }

    next();
  };
};
