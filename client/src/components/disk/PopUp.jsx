import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir } from "../../actions/file";
import { setPopupDisplay } from "../../reducers/fileReducer";
import Input from "../../utils/input/Input";

const PopUp = () => {
    const [dirName, setDirName] = useState("");
    const popupDisplay = useSelector((state) => state.files.popupDisplay);
    const currentDir = useSelector((state) => state.files.currentDir);
    const dispatch = useDispatch();
    const createDirHandler = () => {
        dispatch(createDir(currentDir, dirName));
    };

    return (
        <div
            className="popup"
            style={{ display: popupDisplay }}
            onClick={() => dispatch(setPopupDisplay("none"))}
        >
            <div
                className="popup__content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup__header">
                    <div className="popup__title">Create new folder</div>
                    <button
                        className="popup__close"
                        onClick={() => dispatch(setPopupDisplay("none"))}
                    >
                        X
                    </button>
                </div>
                <Input
                    type="text"
                    placeholder="Enter the name of the directory"
                    value={dirName}
                    setValue={setDirName}
                />
                <button
                    onClick={() => createDirHandler()}
                    className="popup__create"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default PopUp;
