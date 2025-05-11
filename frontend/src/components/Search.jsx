import React, { useState } from "react";
import { searchBooks } from "../api/api"; // Ensure API function supports filters
import "bootstrap/dist/css/bootstrap.min.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState("");
    const [language, setLanguage] = useState("");
    const [orderBy, setOrderBy] = useState("relevance");

    const defaultThumbnail = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

    const handleSearch = async (isNewSearch = false) => {
        if (!query.trim()) return;
    
        setLoading(true);
        setError("");
    
        try {
            const currentPage = isNewSearch ? 0 : page + 1; // Reset page on new search
            const results = await searchBooks(query, currentPage, category, language, orderBy); // Pass filters
    
            if (!results || !results.books) {
                throw new Error("Invalid API response");
            }
    
            const formattedBooks = results.books.map((book) => ({
                id: book.id,
                title: book.title || "No Title Available",
                authors: book.authors?.length > 0 ? book.authors : ["Unknown Author"],
                thumbnail: book.thumbnail || defaultThumbnail,
                infoLink: book.preview_link || "#",
            }));
    
            setBooks(isNewSearch ? formattedBooks : [...books, ...formattedBooks]); // Append books
            setPage(currentPage);
        } catch (err) {
            console.error("Error fetching books:", err);
            setError("Something went wrong. Please try again.");
        }
    
        setLoading(false);
    };

    // 🔹 Re-run search when filters change
    const handleFilterChange = () => {
        handleSearch(true);
    };

    return (
        <div className="container mt-4">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a book..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => handleSearch(true)}>
                    Search
                </button>
            </div>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <select className="form-select" value={category} onChange={(e) => { setCategory(e.target.value); handleFilterChange(); }}>
                        <option value="">All Categories</option>
                        <option value="fiction">Fiction</option>
                        <option value="nonfiction">Nonfiction</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="biography">Biography</option>
                        <option value="science">Science</option>
                        <option value="history">History</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select className="form-select" value={language} onChange={(e) => { setLanguage(e.target.value); handleFilterChange(); }}>
                        <option value="">All Languages</option>
                        <option value="he">Hebrew</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select className="form-select" value={orderBy} onChange={(e) => { setOrderBy(e.target.value); handleFilterChange(); }}>
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {loading && <div className="alert alert-info">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Book Results */}
            <div className="row">
                {books.map((book) => (
                    <div key={book.id} className="col-md-4">
                        <div className="card mb-3">
                            <img src={book.thumbnail} className="card-img-top" alt="Book Cover" />
                            <div className="card-body">
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text">{book.authors.join(", ")}</p>
                                <a href={book.infoLink} target="_blank" rel="noopener noreferrer">
                                    More Info
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {books.length > 0 && (
                <div className="text-center mt-3">
                    <button className="btn btn-secondary" onClick={() => handleSearch(false)}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Search;
