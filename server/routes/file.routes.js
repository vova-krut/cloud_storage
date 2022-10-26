import { Router } from "express";
import fileController from "../controllers/file.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/", authMiddleware, fileController.createDir);
router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/", authMiddleware, fileController.fetchFiles);

export default router;
