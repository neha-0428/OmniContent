import Collection from "@/models/Collection.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export const createCollection = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, fields } = req.body;

    const orgId = req.user.orgId;

    const slug = name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_]+/g, "-")
                .replace(/^-+|-+$/g, "");

    const existingCollection = await Collection.findOne({ orgId, slug });

    if (existingCollection) {
        throw new AppError(`A Blueprint with name ${name} already exists in this organisation`, 400)
    }

    const collections = await Collection.create([
      {
        orgId,
        name,
        slug,
        fields,
      },
    ]);

    const collection = collections[0];

    if (!collection) {
      throw new AppError("Failed to create Blueprint!", 400);
    }

    res.status(201).json({
      message: "Blueprint created successfully!",
      data: collection,
    });
  },
);
