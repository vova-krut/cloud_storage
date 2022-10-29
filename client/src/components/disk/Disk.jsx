import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import FileList from "./fileList/FileList";
import "./disk.css";
import PopUp from "./PopUp";
import { setCurrentDir, setPopupDisplay } from "../../reducers/fileReducer";
import Uploader from "./uploader/Uploader";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector((state) => state.files.currentDir);
    const dirStack = useSelector((state) => state.files.dirStack);
    const [dragEnter, setDragEnter] = useState(false);
    const [sort, setSort] = useState("type");

    useEffect(() => {
        dispatch(getFiles(currentDir, sort));
    }, [currentDir, sort]);

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

    const dragEnterHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    };

    const dragLeaveHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    };

    const dropHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let files = [...event.dataTransfer.files];
        files.forEach((file) => dispatch(uploadFile(file, currentDir)));
        setDragEnter(false);
    };

    return !dragEnter ? (
        <div
            className="disk"
            onDragEnter={dragEnterHandler}
            onDragLeave={dragLeaveHandler}
            onDragOver={dragEnterHandler}
        >
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
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="disk__select"
                >
                    <option value="name">By name</option>
                    <option value="type">By type</option>
                    <option value="date">By date</option>
                    <option value="size">By size</option>
                </select>
            </div>
            <FileList />
            <PopUp />
            <Uploader />
        </div>
    ) : (
        <div
            className="drop-area"
            onDrop={dropHandler}
            onDragEnter={dragEnterHandler}
            onDragLeave={dragLeaveHandler}
            onDragOver={dragEnterHandler}
        >
            Drag your files here
        </div>
    );
};

export default Disk;
