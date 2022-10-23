import ApiError from "../errors/api.error.js";
import User from "../models/User.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import fileService from "./file.service.js";
import File from "../models/File.js";

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest(
                `User with email ${email} already exists`
            );
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashPassword,
        });
        await fileService._createDirectoryInFs(
            new File({ user: user._id, name: "" })
        );
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw ApiError.BadRequest(`Email or password is incorrect`);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            throw ApiError.BadRequest(`Email or password is incorrect`);
        }

        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "1h",
        });

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

    async authByToken(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "1h",
        });

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
