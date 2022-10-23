import { Router } from "express";
import authRouter from "./auth.routes.js";
import fileRouter from "./file.routes.js";

const router = new Router();

router.use("/auth", authRouter);
router.use("/file", fileRouter);

export default router;
