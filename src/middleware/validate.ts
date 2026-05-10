import { catchAsync } from "@/utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync(req.body)
        next()
    })
}