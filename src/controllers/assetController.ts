import Asset from "@/models/Asset.js";
import { AppError } from "@/utils/AppError.js";
import { uploadToCloudinary } from "@/utils/cloudinary.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import multer from "multer";

export const uploadAsset = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const file = req.file;

        if (!file) {
            throw new AppError('File Not Found!', 400);
        }

        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const fileBuffer: Buffer = file.buffer;
            
            const uploadResponse = await uploadToCloudinary(fileBuffer, String(req.user.orgId), file.originalname);
            
            if (!uploadResponse || !uploadResponse.asset_id) {
                throw new AppError('Cloud media storage provider upload failed.', 500);
            }

            const newAssets = await Asset.create([
                { 
                    orgId: req.user.orgId,
                    url: uploadResponse.secure_url,
                    fileName: file.originalname,
                    mimeType: uploadResponse.resource_type,
                    fileSize: uploadResponse.bytes,
                    uploadedBy: req.user
                }
            ], { session });

            await session.commitTransaction()
            session.endSession()
            res.status(201).send({ message: 'File Uploaded Successfully!', data: newAssets[0] });

        } catch (error) {

            await session.abortTransaction()
            session.endSession()

            console.error('File upload transactional error:', error);

            res.status(500).send({ message: 'Failed to complete transaction asset registration.'});
        }

    }
)