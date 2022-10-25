import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
import FileList from "./fileList/FileList";
import "./disk.css";
import PopUp from "./PopUp";
import { setPopupDisplay } from "../../reducers/fileReducer";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector((state) => state.files.currentDir);

    useEffect(() => {
        dispatch(getFiles(currentDir));
    }, [currentDir]);

    const showPopUp = () => {
        dispatch(setPopupDisplay("flex"));
    };

    return (
        <div className="disk">
            <div className="disk__btns">
                <button className="disk__back">Back</button>
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
