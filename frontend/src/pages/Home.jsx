import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/home.css";

const Home = () => {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const welcomeMessage = user.full_name
        ? `Welcome, ${user.full_name}!`
        : "Welcome to the #1 Book-Review App!";
    return (
        <div className="home-container">
            <Navbar setShowSearchModal={setShowSearchModal} />

            {/* Hero Section */}
            <div className="container-fluid hero-section">
                <div className="hero-content text-center">
                    <h1>{welcomeMessage}</h1>
                    <p>Here You can Discover, Review, and Share your love for books</p>
                </div>

                {/* Quote Section at the bottom */}
                <div className="quote-container">
                    <blockquote className="quote">
                        "Show me a family of readers, and I will show you the people who move the world." – Napoleon Bonaparte
                    </blockquote>
                </div>
            </div>

            {/* Search Modal */}
            {showSearchModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Search Books</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSearchModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <Search />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {showSearchModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Home;
