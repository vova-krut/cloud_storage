import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = new Router();

router.post(
    "/registration",
    body("email", "Email is required").isEmail(),
    body(
        "password",
        "Password must be longer than 3 and shorter than 16"
    ).isLength({ min: 3, max: 16 }),
    userController.registration
);

router.post("/login", userController.login);

router.get("/auth", authMiddleware, userController.authByToken);

export default router;
