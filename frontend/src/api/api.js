import axios from "axios";
const API_URL = "http://localhost:8000";

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Search books in google api
export const searchBooks = async (query, page = 0, category = "", language = "", orderBy = "relevance") => {
  try {
    const startIndex = page * 10;

    let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10&orderBy=${orderBy}`;

    if (category) url += `+subject:${category}`;
    if (language) url += `&langRestrict=${language}`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      books: data.items ? data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
        preview_link: item.volumeInfo.previewLink || "",
      })) : []
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [] };
  }
};

// Add Review on a book
export const addReview = async (reviewData, setReviews, setError) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    setError("User not logged in.");
    return;
  }

  const newReview = {
    user_id: userId,
    ...reviewData,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/add_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });

    if (!response.ok) {
      throw new Error("Failed to add review");
    }
    const res = await fetch(`http://127.0.0.1:8000/user_reviews/${userId}`);
    const data = await res.json();
    setReviews(data);
  } catch (err) {
    console.error("Error adding review:", err);
    setError("Failed to add review.");
  }
};


// Fetch all User Reviews
export const fetchUserReviews = async (setReviews, setError) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    setError("User not logged in.");
    return;
  }

  try {

    const response = await fetch(`http://127.0.0.1:8000/user_reviews/${userId}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const data = await response.json();
    setReviews(data);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    setError(`Failed to load reviews. Error: ${err.message}`);
  }
};

export const updateReview = async (reviewData, setReviews, setError) => {
  if (!reviewData.review_id) {
    setError("Review ID is required for updating.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/reviews/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("Failed to update review");
    }

    const userId = localStorage.getItem("user_id");
    const res = await fetch(`http://127.0.0.1:8000/user_reviews/${userId}`);
    const data = await res.json();
    setReviews(data);
  } catch (err) {
    console.error("Error updating review:", err);
    setError("Failed to update review.");
  }
};
export const deleteReview = async (review_id, setReviews, setError) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/reviews/delete?review_id=${review_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to delete review: ${response.status} - ${responseText}`);
    }

    setReviews(prevReviews => prevReviews.filter(review => review.id !== review_id));
  } catch (err) {
    console.error("Error deleting review:", err);
    setError("Failed to delete review.");
  }
};



