import { model, Schema, Types } from "mongoose";

interface AssetInterface {
    orgId: Types.ObjectId,
    url: string,
    fileName: string, // original file name of asset
    mimeType: string,
    fileSize: number,
    uploadedBy: Types.ObjectId
}

const AssetSchema = new Schema<AssetInterface>(
    {
        orgId: {
            type: Schema.Types.ObjectId,
            ref: 'Organisation',
            required: true,
            index: true
        },
        url: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
            index: true
        },
        mimeType: {
            type: String,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

const Asset = model<AssetInterface>('Asset', AssetSchema)
export default Asset;