import { FieldInterface } from "@/models/Collection.js";
import Entry, { EntryInterface } from "@/models/Entry.js";
import { AppError } from "@/utils/AppError.js";
import { Types } from "mongoose";

export interface EntryDTO {
  orgId: Types.ObjectId;
  collection: Record<string, any>;
  userId: Types.ObjectId;
  content: Record<string, any>;
  status: "Draft" | "Published";
  version: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export const createEntryService = async (data: EntryDTO) => {
  const fields = data.collection.fields;

  fields.forEach((field: FieldInterface) => {
    const fieldValue = data.content[field.name];

    if (!fieldValue) {
      throw new AppError(`Missing ${field.name}`, 400);
    }

    if (!fieldValue || typeof fieldValue !== field.type) {
      throw new AppError("Validation Error", 400);
    }
  });

  const Entries = (await Entry.create([
    {
      orgId: data.orgId,
      collectionId: data.collection._id,
      content: data.content,
      status: data.status ?? 'Draft',
      version: data.version ?? 1,
      createdBy: data.userId,
    },
  ])) as EntryInterface[];

  if (!Entries) {
    throw new AppError("Failed creating Entry!", 400);
  }

  const entryData = Entries[0];
};
