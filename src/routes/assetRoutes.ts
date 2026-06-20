import { uploadAsset } from "@/controllers/assetController.js";
import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize : 5 * 1024 * 1024 } // 5MB
})

router.use('/upload', upload.single('file'), uploadAsset);

export default router;