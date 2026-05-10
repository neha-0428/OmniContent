import User from "@/models/User.js";
import { registerService } from "@/services/authService.js";
import { Request, Response } from "express";
import { AppError } from "@/utils/AppError.js";
import expressAsyncHandler from "express-async-handler";

export const registerOrganisation = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  
  const response = await registerService(req.body)
  res.status(201).json({ 
    message: "Organisation created successfully!", 
    data: response 
  });
});
