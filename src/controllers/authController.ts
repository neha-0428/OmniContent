import User from "@/models/User.js";
import { generateJwtToken, registerService } from "@/services/authService.js";
import { Request, Response } from "express";
import { AppError } from "@/utils/AppError.js";
import expressAsyncHandler from "express-async-handler";

export const registerOrganisation = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const response = await registerService(req.body);
    res.status(201).json({
      message: "Organisation created successfully!",
      data: response,
    });
  },
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      const accessToken = generateJwtToken(user);

      res.status(200).json({
        message: "Logged In successfully!",
        accessToken: accessToken,
      });
    } else {
      throw new AppError("Login failed!", 500);
    }
  },
);


export const getMe = (req: Request, res: Response) => {
  return res.status(200).json({ data: req.user})
}