import User from "@/models/User.js";
import { registerService } from "@/services/authService.js";
import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { AppError } from "@/utils/AppError.js";

export const registerOrganisation = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  
  const response = await registerService(req.body)
  return res
    .status(201)
    .json({ message: "Organisation created successfully!", data: response });
});
