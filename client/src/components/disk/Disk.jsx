import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import FileList from "./fileList/FileList";
import "./disk.css";
import PopUp from "./PopUp";
import { setCurrentDir, setPopupDisplay } from "../../reducers/fileReducer";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector((state) => state.files.currentDir);
    const dirStack = useSelector((state) => state.files.dirStack);

    useEffect(() => {
        dispatch(getFiles(currentDir));
    }, [currentDir]);

    const showPopUp = () => {
        dispatch(setPopupDisplay("flex"));
    };

    const backClickHandler = () => {
        const backDirId = dirStack.pop();
        dispatch(setCurrentDir(backDirId));
    };

    const fileUploadHandler = (event) => {
        const files = [...event.target.files];
        files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    };

    return (
        <div className="disk">
            <div className="disk__btns">
                <button
                    className="disk__back"
                    onClick={() => backClickHandler()}
                >
                    Back
                </button>
                <button className="disk__create" onClick={() => showPopUp()}>
                    Create a folder
                </button>
                <div className="disk__upload">
                    <label
                        htmlFor="disk__upload-input"
                        className="disk__upload-label"
                    >
                        Upload file
                    </label>
                    <input
                        multiple={true}
                        onChange={(event) => fileUploadHandler(event)}
                        type="file"
                        id="disk__upload-input"
                        className="disk__upload-input"
                    />
                </div>
            </div>
            <FileList />
            <PopUp />
        </div>
    );
};

export default Disk;
