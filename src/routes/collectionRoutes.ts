import express from "express";
import { createCollection } from "@/controllers/collectionController.js";
import { validate } from "@/middleware/validate.js";
import { createCollectionSchema } from "@/shared/collectionSchema.js";

const router = express.Router();

router.post("create", validate(createCollectionSchema), createCollection);

export default router;
