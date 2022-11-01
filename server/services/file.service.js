import File from "../models/File.js";
import ApiError from "../errors/api.error.js";
import userService from "./user.service.js";
import fsService from "./fs.service.js";
import * as uuid from "uuid";
import config from "config";

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
                fsService.createDirectoryInFs(dir);
            } else {
                await this._addDirToParent(dir, parentDir);
            }

            await dir.save();

            return dir;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async fetchFiles(user, parent, sort) {
        try {
            const files = sort
                ? await File.find({ user, parent }).sort({ [sort]: 1 })
                : await File.find({ user, parent });

            return files;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async uploadFile(file, userId, parentId) {
        try {
            const user = await userService.findUserById(userId);

            const parent = await File.findOne({
                user: user._id,
                _id: parentId,
            });

            this._checkUserForFreeSpace(file, user);

            const dbFile = this._registerFileInDb(file, user, parent);

            fsService.registerFileInFs(dbFile);

            await this._confirmFileUpload(
                file,
                fsService.filePath,
                user,
                dbFile,
                parent
            );

            return dbFile;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async downloadFile(fileId, userId) {
        try {
            const file = await File.findOne({ _id: fileId, user: userId });
            const path = fsService.getFilePath(file);

            return { file, path };
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async deleteFile(fileId, userId) {
        try {
            const file = await File.findOne({ _id: fileId, user: userId });

            if (!file) {
                throw new ApiError(400, "File not found");
            }

            fsService.deleteFile(file);

            await file.remove();
            await this._deleteFileFromUser(file, userId);
            await this._deleteFileFromParent(file);
        } catch (e) {
            throw new ApiError(400, "Dir is not empty");
        }
    }

    async searchForFiles(searchWord, userId) {
        try {
            let files = await File.find({ user: userId });
            files = files.filter((file) => file.name.includes(searchWord));

            return files;
        } catch (e) {
            throw new ApiError(400, "Search error");
        }
    }

    async uploadAvatar(file, userId) {
        try {
            const user = await userService.findUserById(userId);

            const avatarName = uuid.v4() + ".jpg";
            const path = config.get("staticPath") + "\\" + avatarName;

            user.avatar = avatarName;

            await this._confirmFileUpload(file, path, user);

            return user;
        } catch (e) {
            throw new ApiError(400, "Upload avatar error");
        }
    }

    async deleteAvatar(userId) {
        try {
            const user = await userService.findUserById(userId);

            fsService.deleteAvatar(user.avatar);

            user.avatar = null;

            await user.save();

            return user;
        } catch (e) {
            throw new ApiError(400, "Delete avatar error");
        }
    }

    async _confirmFileUpload(file, path, user, dbFile, parent) {
        file.mv(path);

        await dbFile?.save();
        await user?.save();
        await parent?.save();
    }

    _checkUserForFreeSpace(file, user) {
        if (user.usedSpace + file.size > user.diskSpace) {
            throw new ApiError(400, "There is no free space");
        }

        user.usedSpace += file.size;
    }

    async _deleteFileFromUser(file, userId) {
        const user = await userService.findUserById(userId);

        user.usedSpace -= file.size;
        await user.save();
    }

    async _deleteFileFromParent(file) {
        const parent = await File.findById(file.parent);

        if (parent) {
            parent.size -= file.size;
            await parent.save();
        }
    }

    _registerFileInDb(file, user, parent) {
        const type = file.name.split(".").pop();

        const filePath = parent ? `${parent.path}\\${file.name}` : file.name;

        const dbFile = new File({
            name: file.name,
            type,
            size: file.size,
            path: filePath,
            parent: parent?._id,
            user: user._id,
        });

        if (parent) {
            parent.size += file.size;
        }

        return dbFile;
    }

    async _addDirToParent(dir, parentDir) {
        dir.path = `${parentDir.path}\\${dir.name}`;

        fsService.createDirectoryInFs(dir);

        parentDir.children.push(dir._id);

        await parentDir.save();
    }
}

export default new FileService();
