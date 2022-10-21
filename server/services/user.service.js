import ApiError from "../errors/api.error.js";
import User from "../models/User.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email });

        if (candidate) {
            throw new ApiError.BadRequest(
                `User with email ${email} already exists`
            );
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashPassword,
        });
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError.BadRequest(`Email or password is incorrect`);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            throw new ApiError.BadRequest(`Email or password is incorrect`);
        }

        const token = jwt.sign(
            { id: user.id, email },
            config.get("secretKey"),
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
            },
        };
    }
}

export default new UserService();
