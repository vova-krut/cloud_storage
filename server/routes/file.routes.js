import { Router } from "express";
import fileController from "../controllers/file.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/", authMiddleware, fileController.createDir);
router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/", authMiddleware, fileController.fetchFiles);
router.get("/download", authMiddleware, fileController.downloadFile);
router.get("/search", authMiddleware, fileController.searchForFiles);
router.delete("/", authMiddleware, fileController.deleteFile);

export default router;
