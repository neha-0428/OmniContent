import ApiKey from "@/models/ApiKey.js";
import { AppError } from "@/utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export const validateApiKey = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawApiKey = req.headers["x-api-key"];

    if (!rawApiKey) {
      throw new AppError("API Key ('x-api-key') header is missing.", 401);
    }

    // Narrowing / Casting to string to protect against string array attacks
    const apiKey = Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey;

    const apiKeyData = await ApiKey.findOne({ key: apiKey, isActive: true });

    if (!apiKeyData) {
      throw new AppError("Access Denied: Invalid or revoked API Key.", 403);
    }

    req.orgId = apiKeyData.orgId;

    next();
  },
);
