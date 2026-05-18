import Collection from "@/models/Collection.js";
import Entry from "@/models/Entry.js";
import { createEntryService, updateEntryService } from "@/services/entryService.js";
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

    const orgId = req.user.orgId;
    const collection = await Collection.findOne({ orgId: orgId, slug: collectionSlug });

    if (!collection) {
      throw new AppError("Collection Not Found!", 404);
    }

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


export const updateEntry = expressAsyncHandler(
  async (req: Request, res: Response) => {

    const entryId = req.params.entryId

    const { content, status } = req.body;

    if (!entryId) {
      throw new AppError('EntryId not found!', 404)
    }

    const orgId = req.user.orgId;
    const userId = req.user._id;

    const entry = await Entry.findOne({ _id: entryId, orgId })
    if (!entry) {
      throw new AppError('EntryId not found!', 404)
    }

    const collection = await Collection.findOne({ _id: entry.collectionId })
    if (!collection) {
      throw new AppError('Collection not found!', 404)
    }

    const entryData = await updateEntryService({
      orgId,
      collection,
      userId,
      content,
      status,
      createdBy: userId,
      updatedBy: userId,
      entryId: entry._id
    }, entry);

    res.status(200).json({
      message: "Entry updated successfully",
      data: entryData,
    });
  }
)