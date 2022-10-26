import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
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
            </div>
            <FileList />
            <PopUp />
        </div>
    );
};

export default Disk;
