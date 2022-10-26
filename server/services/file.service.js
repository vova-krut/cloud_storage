import fs from "fs";
import File from "../models/File.js";
import config from "config";
import ApiError from "../errors/api.error.js";
import userService from "./user.service.js";

class FileService {
    fsService = new FsService();

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
                this.fsService._createDirectoryInFs(dir);
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
            const user = await userService.findUserById(userId);

            if (parentId) {
                const dbFile = await this._uploadFileToParent(
                    file,
                    user,
                    parentId
                );
                return dbFile;
            }

            await this._checkUserForFreeSpace(file, user);

            const dbFile = this._registerFileInDb(file, user);

            this.fsService._registerFileInFs(dbFile, user);

            await this._confirmFileUpload(dbFile, user);

            return dbFile;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async _uploadFileToParent(file, user, parentId) {
        const parent = await File.findOne({ user: user._id, _id: parentId });

        await this._checkUserForFreeSpace(file, user);

        const dbFile = this._registerFileInDb(file, user, parent);

        this.fsService._registerFileInFs(dbFile, parent);

        await this._confirmFileUpload(dbFile, user, parent);

        return dbFile;
    }

    async _confirmFileUpload(file, user, parent) {
        await file.save();
        await user.save();
        file.mv(this.fsService.path);
        await parent?.save();
    }

    async _addDirToParent(dir, parentDir) {
        dir.path = `${parentDir.path}\\${dir.name}`;

        this.fsService._createDirectoryInFs(dir);

        parentDir.children.push(dir._id);

        await parentDir.save();
    }

    async _checkUserForFreeSpace(file, user) {
        if (user.usedSpace + file.size > user.diskSpace) {
            throw new ApiError(400, "There is no free space");
        }

        user.usedSpace += file.size;
    }

    _registerFileInDb(file, user, parent) {
        const type = file.name.split(".").pop();

        const dbFile = new File({
            name: file.name,
            type,
            size: file.size,
            path: parent?.path,
            parent: parent?._id,
            user: user._id,
        });

        return dbFile;
    }
}

class FsService {
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

    _registerFileInFs(file, parent) {
        this.path = `${config.get("filePath")}\\${file.user}\\${
            parent?.path || ""
        }\\${file.name}`;

        if (fs.existsSync(path)) {
            throw new ApiError(400, "File already exists");
        }
    }
}

export default new FileService();
