import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
    return expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync(req.body)
        next()
    })
}