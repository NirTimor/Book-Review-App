import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyReviews from "./pages/MyReviews";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./components/Search";

const AppContent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const userId = localStorage.getItem("user_id");
            const loginTime = localStorage.getItem("login_time");

            if (!userId || !loginTime) {
                setIsAuthenticated(false);
                return false;
            }

            const loginDate = new Date(loginTime);
            const now = new Date();
            const diffInMs = now - loginDate;
            const diffInMinutes = diffInMs / (1000 * 60);

            if (diffInMinutes > 60) {
                localStorage.removeItem("user_id");
                localStorage.removeItem("login_time");
                setIsAuthenticated(false);
                return false;
            }

            setIsAuthenticated(true);
            return true;
        };

        const isValid = checkAuth();
        if (!isValid && location.pathname !== "/login" && location.pathname !== "/register") {
            navigate("/login");
        }
    }, [location, navigate]);

    const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

    return (
        <>
            {!hideNavbar && <Navbar setShowSearchModal={setShowSearchModal} setShowLogoutModal={setShowLogoutModal} />}

            <Routes>
                <Route path="/" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/my_reviews" element={isAuthenticated ? <MyReviews /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
            </Routes>

            {/* Modals */}
            {showSearchModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Search Books</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSearchModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <Search />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Logout</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to log out?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>No</button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        localStorage.removeItem("user_id");
                                        localStorage.removeItem("login_time");
                                        setIsAuthenticated(false);
                                        navigate("/login");
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(showSearchModal || showLogoutModal) && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;