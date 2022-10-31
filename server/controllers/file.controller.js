import fileService from "../services/file.service.js";

class FileController {
    async createDir(req, res, next) {
        try {
            const { name, type, parent } = req.body;
            const file = await fileService.createDir(
                name,
                type,
                parent,
                req.user.id
            );
            return res.json({ file });
        } catch (e) {
            next(e);
        }
    }

    async fetchFiles(req, res, next) {
        try {
            const files = await fileService.fetchFiles(
                req.user.id,
                req.query.parent,
                req.query.sort
            );
            return res.json({ files });
        } catch (e) {
            next(e);
        }
    }

    async uploadFile(req, res, next) {
        try {
            const file = req.files.file;
            const userId = req.user.id;
            const parentId = req.body.parent;
            const dbFile = await fileService.uploadFile(file, userId, parentId);
            return res.json(dbFile);
        } catch (e) {
            next(e);
        }
    }

    async downloadFile(req, res, next) {
        try {
            const fileId = req.query.id;
            const userId = req.user.id;
            const { file, path } = await fileService.downloadFile(
                fileId,
                userId
            );
            return res.download(path, file.name);
        } catch (e) {
            next(e);
        }
    }

    async deleteFile(req, res, next) {
        try {
            const fileId = req.query.id;
            const userId = req.user.id;
            await fileService.deleteFile(fileId, userId);
            return res.json({ message: "File was deleted" });
        } catch (e) {
            next(e);
        }
    }

    async searchForFiles(req, res, next) {
        try {
            const searchWord = req.query.search;
            const userId = req.user.id;
            const files = await fileService.searchForFiles(searchWord, userId);
            return res.json({ files });
        } catch (e) {
            next(e);
        }
    }
}

export default new FileController();
