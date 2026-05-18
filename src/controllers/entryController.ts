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

export const getEntries = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { collectionSlug } = req.params
    if (!collectionSlug) {
      throw new AppError('No collection found!', 404);
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10))
    const status = req.query.status as string
    const search = req.query.search as string

    const orgId = req.user.orgId

    const collection = await Collection.findOne({ orgId, slug: collectionSlug })
    if (!collection) {
      throw new AppError('No Collection Found', 404);
    }

    const queryConditons: Record<string, any> = {
      orgId,
      collectionId: collection._id,
    }

    if (status) {
      queryConditons.status = status
    }

    if (search) {
      const textFields = collection.fields.filter((f) => f.type === 'text' || f.type === 'rich-text')
      
      if (textFields.length > 0) {
        queryConditons.$or = textFields.map((field) => ({
          [`content.${field.name}`] : { $regex: search, $options: "i" }
        }))
      }
    }

    const skipAmount = (page - 1) * limit

    const [totalItems, entries] = await Promise.all([
      Entry.countDocuments(queryConditons),
      Entry.find(queryConditons)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate("updatedBy", "name email")
      .lean()
    ]);

    const totalPages = Math.ceil(totalItems/limit)

    res.status(200).json({
      message: "Entries fetched successfully",
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      data: entries
    });
  }
)