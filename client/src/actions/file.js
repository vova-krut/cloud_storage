import axios from "axios";
import { addFile, setFiles } from "../reducers/fileReducer";

export function getFiles(dirId) {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/file${
                    dirId ? `?parent=${dirId}` : ""
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            dispatch(setFiles(response.data.files));
        } catch (e) {
            alert(e.response.data.message);
        }
    };
}

export function createDir(dirId, name) {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/file`,
                {
                    name,
                    parent: dirId,
                    type: "dir",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            dispatch(addFile(response.data));
        } catch (e) {
            console.error(e.response.data);
            alert(e.response.data.message);
        }
    };
}
