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
                req.query.parent
            );
            return res.json({ files });
        } catch (e) {
            next(e);
        }
    }
}

export default new FileController();
