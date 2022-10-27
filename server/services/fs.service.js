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

    registerFileInFs(file, parent) {
        this.path = `${config.get("filePath")}\\${file.user}\\${
            parent?.path || ""
        }\\${file.name}`;

        if (fs.existsSync(this.path)) {
            throw new ApiError(400, "File already exists");
        }
    }
}

export default new FsService();