import { validationResult } from "express-validator";
import ApiError from "../errors/api.error.js";
import userService from "../services/user.service.js";

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest("Validation error", errors.errors)
                );
            }

            const { email, password } = req.body;
            const user = await userService.registration(email, password);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const data = await userService.login(email, password);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async authByToken(req, res, next) {
        try {
            const userId = req.user.id;
            const data = await userService.authByToken(userId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
