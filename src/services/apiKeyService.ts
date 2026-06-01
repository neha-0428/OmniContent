import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import ApiKey from "@/models/ApiKey.js";
import { AppError } from "@/utils/AppError.js";

export const generateApiKey = expressAsyncHandler(
    async (req: Request, res: Response) => {

        const orgId = req.user.orgId
        const keyName = req.body.name

        if (!keyName || !keyName.trim()) {
            throw new AppError('Key name is required and cannot be empty.', 400);        
        }

        const randomString = crypto.randomBytes(16).toString('hex')
        const apiKey = `cms_live_${randomString}`

        const apiKeyEntry = await ApiKey.create({
            orgId,
            name: keyName,
            key: apiKey,
        })

        res.status(201).json({
            message: "API KEY created successfully",
            data: apiKeyEntry,
        });
    }
)