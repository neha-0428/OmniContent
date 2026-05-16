import Collection from "@/models/Collection.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export const createCollection = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, fields } = req.body;

    const collections = await Collection.create([
      {
        name: name,
        fields: fields,
      },
    ]);

    const collection = collections[0];

    if (!collection) {
      throw new AppError("Blueprint already exists!", 400);
    }

    res.status(201).json({
      message: "Blueprint created successfully!",
      data: collection,
    });
  },
);
