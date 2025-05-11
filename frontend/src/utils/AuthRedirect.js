import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const loginTime = localStorage.getItem("login_time");

        if (!userId || !loginTime) {
            navigate("/login");
            return;
        }

        const loginDate = new Date(loginTime);
        const now = new Date();
        const diffInMs = now - loginDate;
        const diffInMinutes = diffInMs / (1000 * 60);

        if (diffInMinutes > 60) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("login_time");
            navigate("/login");
        } else {
            navigate("/home");
        }
    }, [navigate]);

    return null;
};

export default AuthRedirect;
