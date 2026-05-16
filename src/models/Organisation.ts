import mongoose, { Schema, model, type Document } from "mongoose";
import slugUpdater from "mongoose-slug-updater";

export interface OrganisationInterface extends Document {
  name: string;
  slug: string;
  settings: {
    theme: "light" | "dark";
  };
  isActive: boolean;
  subscription_plan: string;
  createdAt: Date;
  updatedAt: Date;
}

const organisationSchema = new Schema<OrganisationInterface>(
  {
    name: {
      type: String,
      required: [true, "Organization Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription_plan: {
      type: String,
      enum: ["Free", "Pro", "Enterprise"],
      default: "Free",
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Organisation = model<OrganisationInterface>(
  "Organisation",
  organisationSchema,
);
export default Organisation;
