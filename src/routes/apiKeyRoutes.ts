import { generateApiKey } from "@/services/apiKeyService.js";
import express from "express";

const router = express.Router();

router.post('/create', generateApiKey);

export default router;