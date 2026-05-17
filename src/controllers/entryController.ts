import Collection from "@/models/Collection.js";
import { createEntryService } from "@/services/entryService.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";


export const createEntry = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { content, status, version } = req.body;

    const { collectionSlug } = req.params

    if (!collectionSlug) {
      throw new AppError('Collection Name Not Found!', 404);
    }

    const collection = await Collection.findOne({ slug: collectionSlug });

    if (!collection) {
      throw new AppError("Collection Not Found!", 404);
    }

    const orgId = req.user.orgId;
    const userId = req.user._id;
    const entryData = await createEntryService({
      orgId,
      collection,
      userId,
      content,
      status,
      version,
      createdBy: userId,
      updatedBy: userId,
    });

    res.status(201).json({
      message: "Entry created successfully",
      data: entryData,
    });
  },
);