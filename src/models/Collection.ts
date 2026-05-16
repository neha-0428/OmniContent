import { Document, model, Schema, Types } from "mongoose";

interface FieldInterface {
  name: string;
  type: "text" | "number" | "boolean" | "rich-text";
  required: boolean;
}

interface CollectionInterface extends Document {
  orgId: Types.ObjectId;
  name: string;
  slug: string;
  fields: FieldInterface[];
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema<FieldInterface>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "number", "boolean", "rich-text"],
      default: "text",
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }, // Prevents Mongoose from creating an auto _id for every sub-field
);

const CollectionSchema = new Schema<CollectionInterface>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    fields: [FieldSchema],
  },
  {
    timestamps: true,
  },
);

CollectionSchema.index({ orgId: 1, slug: 1 }, { unique: true });

const Collection = model<CollectionInterface>("Collection", CollectionSchema);
export default Collection;
