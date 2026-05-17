import Collection from "@/models/Collection.js";
import Entry from "@/models/Entry.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export const getPublishedEntries = expressAsyncHandler(
  async (req: Request, res: Response) => {

    const collectionSlug = req.params.collectionSlug as string;
    const orgId = req.headers["x-org-id"];

    if (!orgId) {
      throw new AppError("Organisation ('x-org-id') header is missing", 400);
    }

    const collection = await Collection.findOne({ orgId, slug: collectionSlug });

    if (!collection) {
        throw new AppError('Blueprint not found!', 404)
    }

    const entries = await Entry.find(
        {
            orgId,
            collectionId: collection._id,
            status: 'Published'
        }
    ).select('content createdAt updatedAt')
    .lean(); // Performance move for read-only public routes

    res.status(200).json({
        message: 'Entries fetched successfully!',
        count: entries.length,
        data: entries
    })
  },
);
