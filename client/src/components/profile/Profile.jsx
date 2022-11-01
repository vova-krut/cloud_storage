import React from "react";
import { useDispatch } from "react-redux";
import { deleteAvatar, uploadAvatar } from "../../actions/user";

const Profile = () => {
    const dispatch = useDispatch();

    const changeHandler = (event) => {
        const file = event.target.files[0];
        dispatch(uploadAvatar(file));
    };

    return (
        <div>
            <button onClick={() => dispatch(deleteAvatar())}>
                Delete avatar
            </button>
            <input
                accept="image/*"
                onChange={(e) => changeHandler(e)}
                type="file"
                placeholder="Upload avatar"
            />
        </div>
    );
};

export default Profile;
