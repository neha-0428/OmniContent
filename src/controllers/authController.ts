import User from "@/models/User.js";
import { registerService } from "@/services/authService.js";
import { Request, Response } from "express";

export const registerOrganisation = async (req: Request, res: Response) => {
  const { name, email, password, orgName, subscription_plan } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Organisation already exists!" });
  }
  
  const response = await registerService(req.body)
  return res
    .status(201)
    .json({ message: "Organisation created successfully!", data: response });
};
