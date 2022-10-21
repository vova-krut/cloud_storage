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
}

export default new UserController();
