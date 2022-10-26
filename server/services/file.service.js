import fs from "fs";
import File from "../models/File.js";
import config from "config";
import ApiError from "../errors/api.error.js";
import userService from "./user.service.js";

class FileService {
    async createDir(name, type, parent, userId) {
        try {
            const dir = new File({
                name,
                type,
                parent,
                user: userId,
                path: name,
            });

            const parentDir = await File.findOne({ _id: parent });

            if (!parentDir) {
                this._createDirectoryInFs(dir);
            } else {
                await this._addDirToParent(dir, parentDir);
            }

            await dir.save();

            return dir;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async fetchFiles(user, parent) {
        const files = await File.find({ user, parent });
        return files;
    }

    async uploadFile(file, userId, parentId) {
        try {
            if (parentId) {
                const dbFile = await this._uploadFileToParent(
                    file,
                    userId,
                    parentId
                );
                return dbFile;
            }

            await this._registerFileInUser(file, userId);

            this._registerFileInFs(file, userId);

            const dbFile = await this._registerFileInDb(file, userId);

            return dbFile;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async _uploadFileToParent(file, userId, parentId) {
        const parent = await File.findOne({ user: userId, _id: parentId });
        await this._registerFileInUser(file, userId);
        this._registerFileInFs(file, userId, parent);
        const dbFile = await this._registerFileInDb(file, userId, parent);
        return dbFile;
    }

    _createDirectoryInFs(dir) {
        try {
            const filePath = `${config.get("filePath")}\\${dir.user}\\${
                dir.path
            }`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            } else {
                throw ApiError.BadRequest("File already exists");
            }
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async _addDirToParent(dir, parentDir) {
        dir.path = `${parentDir.path}\\${dir.name}`;
        this._createDirectoryInFs(dir);
        parentDir.children.push(dir._id);
        await parentDir.save();
    }

    async _registerFileInUser(file, userId) {
        const user = await userService.findUserById(userId);

        if (user.usedSpace + file.size > user.diskSpace) {
            throw new ApiError(400, "There is no free space");
        }

        user.usedSpace += file.size;

        await user.save();
    }

    _registerFileInFs(file, userId, parent) {
        const path = `${config.get("filePath")}\\${userId}\\${
            parent?.path || ""
        }\\${file.name}`;

        if (fs.existsSync(path)) {
            throw new ApiError(400, "File already exists");
        }

        file.mv(path);
    }

    async _registerFileInDb(file, userId, parent) {
        const type = file.name.split(".").pop();

        const dbFile = await File.create({
            name: file.name,
            type,
            size: file.size,
            path: parent?.path,
            parent: parent?._id,
            user: userId,
        });

        return dbFile;
    }
}

export default new FileService();
