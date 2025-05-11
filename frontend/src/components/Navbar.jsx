import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ setShowSearchModal }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem('user');
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand">📚 Book Review App</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link text-white"
                                    onClick={() => {
                                        if (!localStorage.getItem("user_id")) {
                                            navigate("/login");
                                        } else {
                                            navigate("/");
                                        }
                                    }}
                                >
                                    Homepage
                                </button>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-white" onClick={() => setShowSearchModal(true)}>
                                    Search Books
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-white" onClick={() => navigate("/my_reviews")}>
                                    My Reviews
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-danger ms-3" onClick={() => setShowLogoutModal(true)}>
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
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
                                <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                                    No
                                </button>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal backdrop */}
            {showLogoutModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default Navbar;
