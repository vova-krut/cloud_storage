import config from "config";
import fs from "fs";
import ApiError from "../errors/api.error.js";

class FsService {
    createDirectoryInFs(dir) {
        try {
            const filePath = this.getFilePath(dir);
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            } else {
                throw ApiError.BadRequest("File already exists");
            }
        } catch (e) {
            throw ApiError.InternalError(e);
        }
    }

    registerFileInFs(file) {
        this.filePath = this.getFilePath(file);

        if (fs.existsSync(this.filePath)) {
            throw new ApiError(400, "File already exists");
        }
    }

    getFilePath(file) {
        return `${config.get("filePath")}\\${file.user}\\${file.path}`;
    }

    deleteFile(file) {
        const path = this.getFilePath(file);
        if (file.type === "dir") {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    deleteAvatar(avatar) {
        fs.unlinkSync(config.get("staticPath") + "\\" + avatar);
    }
}

export default new FsService();
