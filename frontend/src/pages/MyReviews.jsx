import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/MyReviews.css";
import { addReview, updateReview, deleteReview } from "../api/api";

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [reviewData, setReviewData] = useState({
        review_id: "",
        book_name: "",
        content: "",
        rating: 1,
    });

    useEffect(() => {
        const fetchUserReviews = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/user_reviews/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews.");
            }

            setLoading(false);
        };

        fetchUserReviews();
    }, []);

    const handleSubmit = async () => {
        if (isEditing) {
            await updateReview(reviewData, setReviews, setError);
            setSuccessMessage("✅ Review updated successfully!");
        } else {
            await addReview(reviewData, setReviews, setError);
            setSuccessMessage("✅ Review added successfully!");
        }
        setShowModal(false);
        setIsEditing(false);
        setReviewData({ review_id: "", book_name: "", content: "", rating: 1 });
        setTimeout(() => setSuccessMessage(""), 5000);
    };

    const handleEdit = (review) => {
        setReviewData({
            review_id: review.id,
            book_name: review.book_name,
            content: review.content,
            rating: review.rating,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (review_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (!confirmDelete) return;
        await deleteReview(review_id, setReviews, setError);
        setSuccessMessage("✅ Review deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
    };
    return (
        <div className="container-fluid hero-section">
            <div className="hero-content">
                <h2 className="text-center my-4">📖 My Past Reviews</h2>
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccessMessage("")}
                        ></button>
                    </div>
                )}

                <button className="btn btn-success mb-3" onClick={() => {
                    setReviewData({ review_id: "", book_name: "", content: "", rating: 1 });
                    setIsEditing(false);
                    setShowModal(true);
                }}>
                    ➕ Read a new book? Leave a review on it!
                </button>

                {loading ? (
                    <p className="text-center">Loading reviews...</p>
                ) : error ? (
                    <p className="text-center text-danger">{error}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center">You haven't written any reviews yet.</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="card mb-3">
                            <div className="card-header">
                                📖 <strong>{review.book_name}</strong>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{review.content}</p>
                                <p className="card-text">⭐ {review.rating}/5</p>
                                <div>
                                    <button className="btn btn-warning me-2" onClick={() => handleEdit(review)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(review.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                        
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? "Edit Review" : "Add Review"}</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Book Name"
                                    value={reviewData.book_name}
                                    onChange={(e) => setReviewData({ ...reviewData, book_name: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Write your review..."
                                    value={reviewData.content}
                                    onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                                ></textarea>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Rating (1-5)"
                                    min="1"
                                    max="5"
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    {isEditing ? "Update Review" : "Submit Review"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviews;
