import { FieldInterface } from "@/models/Collection.js";
import Entry, { EntryInterface } from "@/models/Entry.js";
import { AppError } from "@/utils/AppError.js";
import { Types } from "mongoose";

export interface EntryDTO {
  orgId: Types.ObjectId;
  collection: Record<string, any>;
  userId: Types.ObjectId;
  content?: Record<string, any>; // Made optional for status-only patches
  status: "Draft" | "Published";
  version?: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  entryId?: Types.ObjectId;
}

const typesMap: Record<string, string> = {
  text: "string",
  "rich-text": "string",
  number: "number",
  boolean: "boolean",
};

export const createEntryService = async (data: EntryDTO) => {
  const fields = data.collection.fields as FieldInterface[];
  const userContent = data.content || {};

  validateBlueprint(fields, userContent);

  const Entries = (await Entry.create([
    {
      orgId: data.orgId,
      collectionId: data.collection._id,
      content: userContent,
      status: data.status || "Draft",
      version: data.version || 1,
      createdBy: data.userId,
      updatedBy: data.userId,
    },
  ])) as EntryInterface[];

  if (!Entries || Entries.length === 0) {
    throw new AppError("Failed creating Entry!", 400);
  }

  return Entries[0];
};

export const updateEntryService = async (data: EntryDTO, existingEntry: any) => {

  const finalContent = data.content ? { ...existingEntry.content, ...data.content } : existingEntry.content
  const finalStatus = data.status || existingEntry.status

  const fields = data.collection.fields as FieldInterface[];

  validateBlueprint(fields, finalContent);

  const updatedEntry = await Entry.findOneAndUpdate(
    { _id: data.entryId, orgId: data.orgId },
    { 
      $set: {
        content: finalContent,
        status: finalStatus,
        updatedBy: data.userId
      },
      $inc: { version: 1 }
    },
    { new: true, runValidators: true }
  );

  if (!updatedEntry) {
    throw new AppError("Failed to update Entry or document not found.", 404);
  }

  return updatedEntry;
};

const validateBlueprint = (
  fields: FieldInterface[],
  userContent: Record<string, any>,
) => {
  fields.forEach((field: FieldInterface) => {
    const fieldValue = userContent[field.name];
    const isProvided = fieldValue !== undefined && fieldValue !== null;

    if (field.required && !isProvided) {
      throw new AppError(
        `The field '${field.name}' is required by the blueprint.`,
        400,
      );
    }

    if (isProvided) {
      const expectedType = typesMap[field.type];
      const actualType = typeof fieldValue;

      if (expectedType !== actualType) {
        throw new AppError(
          `Validation failure: Field '${field.name}' expects a ${field.type}, but received a ${actualType}.`,
          400,
        );
      }
    }
  });
};
