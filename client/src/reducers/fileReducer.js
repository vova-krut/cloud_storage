const SET_FILES = "SET_FILES";
const SET_CURRECT_DIR = "SET_CURRENT_DIR";

const defaultState = {
    files: [],
    currentDir: null,
};

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES:
            return { ...state, files: action.payload };
        case SET_CURRECT_DIR:
            return { ...state, currentDir: action.payload };
        default:
            return state;
    }
}

export const setFiles = (files) => ({ type: SET_FILES, payload: files });
export const setCurrentDir = (dir) => ({ type: SET_CURRECT_DIR, payload: dir });
