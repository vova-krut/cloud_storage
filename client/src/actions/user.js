import axios from "axios";

export const registration = async (email, password) => {
    try {
        await axios.post(`http://localhost:5000/api/auth/registration`, {
            email,
            password,
        });
        alert("Successfully registered");
    } catch (e) {
        alert(e);
    }
};
