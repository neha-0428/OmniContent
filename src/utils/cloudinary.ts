import { v2 as cloudinary } from "cloudinary";
import { AppError } from "./AppError.js";
import path from "path";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_APP_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError('Missing configuration', 401);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

export const uploadToCloudinary = (fileBuffer: Buffer, folderName: string, originalName: string): Promise<any> => {
    return new Promise((resolve, reject) => {

        const fileExt = path.extname(originalName);
        const fileBase = path.basename(originalName, fileExt)

        const sanitizedBase = fileBase.replace(/[^a-zA-Z0-9]/g, "_");

        // Generate a safe public ID that is URL-friendly and keeps the extension
        const safePublicId = `${sanitizedBase}_${Date.now()}${fileExt}`

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `OmniContent/${folderName}`,
                resource_type: "auto",
                public_id: safePublicId
            }, 
            (error, result) => {
                if (error) return reject(error);

                resolve(result)
            }
        );

        uploadStream.end(fileBuffer)
    })

}