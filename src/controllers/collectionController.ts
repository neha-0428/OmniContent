import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";


export const createCollection = expressAsyncHandler(
    async (req: Request, res: Response) => {

        const { name, fields } = req.body

        // const slug = name.slugify

        
    }
)