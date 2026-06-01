import { model, Schema, Types } from "mongoose";

export interface EntryInterface {
    orgId: Types.ObjectId,
    collectionId: Types.ObjectId,
    content: Record<string, any>,
    status: 'Draft' | 'Published',
    version: number
    createdBy: Types.ObjectId,
    updatedBy: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null
}

const entrySchema = new Schema<EntryInterface>(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Organisation',
            index: true
        },
        collectionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Collection',
        },
        content: {
            type: Schema.Types.Mixed,
            required: true
        },
        status: {
            type: String,
            enum: ['Draft', 'Published'],
            default: 'Draft',
            index: true
        },
        version: {
            type: Number,
            default: 1
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true
        }
    }, { timestamps: true }
)

entrySchema.index({ orgId: 1, collectionId: 1, deletedAt: 1 })

entrySchema.index({ orgId: 1, collectionId: 1, status: 1, deletedAt: 1 });

const Entry = model<EntryInterface>('Entry', entrySchema);

export default Entry