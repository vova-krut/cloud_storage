import React from "react";
import dirLogo from "../../../../assets/img/dir.svg";
import fileLogo from "../../../../assets/img/file.svg";
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import "./file.css";
import { downloadFile } from "../../../../actions/file";

const File = ({ file }) => {
    const dispatch = useDispatch();
    const currentDir = useSelector((state) => state.files.currentDir);

    const openDirHandler = (file) => {
        if (file.type === "dir") {
            dispatch(pushToStack(currentDir));
            dispatch(setCurrentDir(file._id));
        }
    };

    const downloadClickHandler = (event) => {
        event.stopPropagation();
        downloadFile(file);
    };

    return (
        <div className="file" onClick={() => openDirHandler(file)}>
            <img
                src={file.type === "dir" ? dirLogo : fileLogo}
                alt=""
                className="file__image"
            />
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0, 10)}</div>
            <div className="file__size">{file.size}</div>
            {file.type !== "dir" && (
                <button
                    onClick={(e) => downloadClickHandler(e)}
                    className="file__btn file__download"
                >
                    Download
                </button>
            )}
            <button className="file__btn file__delete">Delete</button>
        </div>
    );
};

export default File;
