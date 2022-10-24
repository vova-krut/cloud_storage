import fs from "fs";
import File from "../models/File.js";
import config from "config";
import ApiError from "../errors/api.error.js";

class FileService {
    _createDirectoryInFs(file) {
        try {
            const filePath = `${config.get("filePath")}\\${file.user}\\${
                file.path
            }`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async _addFileToParent(file, parentFile) {
        file.path = `${parentFile.path}\\${file.name}`;
        this._createDirectoryInFs(file);
        parentFile.children.push(file._id);
        await parentFile.save();
    }

    async createDir(name, type, parent, userId) {
        try {
            const file = new File({
                name,
                type,
                parent,
                user: userId,
                path: name,
            });

            const parentFile = await File.findOne({ _id: parent });

            if (!parentFile) {
                this._createDirectoryInFs(file);
            } else {
                await this._addFileToParent(file, parentFile);
            }

            await file.save();

            return file;
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    async fetchFiles(user, parent) {
        const files = await File.find({ user, parent });
        return files;
    }
}

export default new FileService();
