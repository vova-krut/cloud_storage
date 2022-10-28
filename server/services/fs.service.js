import config from "config";
import fs from "fs";
import ApiError from "../errors/api.error.js";

class FsService {
    createDirectoryInFs(dir) {
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

    registerFileInFs(file) {
        this.path = this.getFilePath(file);

        if (fs.existsSync(this.path)) {
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
}

export default new FsService();
