import { model, Schema, Types } from "mongoose";

interface ApiKeyInterface {
    orgId: Types.ObjectId,
    name: string,
    key: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}

const ApiKeySchema = new Schema<ApiKeyInterface>(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {timestamps: true}
)

const ApiKey = model<ApiKeyInterface>('ApiKey', ApiKeySchema)

export default ApiKey