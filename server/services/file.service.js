import fs from "fs";
import File from "../models/File.js";
import config from "config";
import ApiError from "../errors/api.error.js";

class FileService {
    _createDirectoryInFs(file) {
        const filePath = `${config.get("filePath")}\\${file.user}\\${
            file.path
        }`;
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                    return resolve({ message: "File was created" });
                } else {
                    return reject({ message: "File already exists" });
                }
            } catch (e) {
                console.log(e);
                return reject({ message: "File error" });
            }
        });
    }

    async createDir(name, type, parent, userId) {
        try {
            const file = new File({ name, type, parent, user: userId });

            const parentFile = await File.findOne({ _id: parent });

            if (!parentFile) {
                file.path = name;
                await this._createDirectoryInFs(file);
            } else {
                file.path = `${parentFile.path}\\${name}`;
                await this._createDirectoryInFs(file);
                parentFile.children.push(file._id);
                await parentFile.save();
            }

            await file.save();

            return file;
        } catch (e) {
            throw ApiError.BadRequest(
                "An error occurred while saving the file",
                [e.message]
            );
        }
    }

    async fetchFiles(user, parent) {
        const files = await File.find({ user, parent });
        return files;
    }
}

export default new FileService();
