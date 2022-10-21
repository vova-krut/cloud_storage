import ApiError from "../errors/api.error.js";
import User from "../models/User.js";
import * as bcrypt from "bcrypt";

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
}

export default new UserService();
