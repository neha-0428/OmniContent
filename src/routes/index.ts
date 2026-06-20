import express, { Request, Response } from "express";
import authRoutes from "./authRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import entryRoutes from "./entryRoutes.js";
import apiKeyRoutes from "./apiKeyRoutes.js";
import assetRoutes from "./assetRoutes.js";
import { protect } from "@/middleware/authMiddleware.js";
import { getPublishedEntries } from "@/controllers/viewerController.js";
import { validateApiKey } from "@/middleware/validateApiKey.js";

const router = express.Router();

router.get('/view/:collectionSlug', validateApiKey, getPublishedEntries);

router.use("/auth", authRoutes);

router.use(protect);

router.use("/collection", collectionRoutes);

router.use("/entries", entryRoutes);

router.use('/api-keys', apiKeyRoutes);

router.use('/asset', assetRoutes);

router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Testing route!" });
});

export default router;
