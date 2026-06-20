import { v2 as cloudinary } from "cloudinary";
import { AppError } from "./AppError.js";

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

export const uploadToCloudinary = (fileBuffer: Buffer, folderName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `OmniContent/${folderName}`,
                resource_type: "auto"
            }, (error, result) => {
                if (error) return reject(error);

                resolve(result)
            }
        );

        uploadStream.end(fileBuffer)
    })

}