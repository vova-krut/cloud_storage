import File from "../models/File.js";
import ApiError from "../errors/api.error.js";
import userService from "./user.service.js";
import fsService from "./fs.service.js";

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

    async fetchFiles(user, parent) {
        const files = await File.find({ user, parent });
        return files;
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

            fsService.registerFileInFs(dbFile, parent);

            await this._confirmFileUpload(file, dbFile, user, parent);

            return dbFile;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async _confirmFileUpload(file, dbFile, user, parent) {
        file.mv(fsService.path);
        await dbFile.save();
        await user.save();
        await parent?.save();
    }

    _checkUserForFreeSpace(file, user) {
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

    async _addDirToParent(dir, parentDir) {
        dir.path = `${parentDir.path}\\${dir.name}`;

        fsService.createDirectoryInFs(dir);

        parentDir.children.push(dir._id);

        await parentDir.save();
    }
}

export default new FileService();
