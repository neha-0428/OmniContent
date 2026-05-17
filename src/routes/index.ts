import express, { Request, Response } from "express";
import authRoutes from "./authRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import entryRoutes from "./entryRoutes.js";
import { protect } from "@/middleware/authMiddleware.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use(protect);

router.use("/collection", collectionRoutes);

router.use("/entries", entryRoutes);

router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Testing route!" });
});

export default router;
