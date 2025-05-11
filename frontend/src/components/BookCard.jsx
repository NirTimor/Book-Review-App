import React from "react";
import { Card, Button } from "react-bootstrap";

const BookCard = ({ book }) => {
    return (
        <Card style={{ width: "18rem", margin: "10px" }}>
            <Card.Img variant="top" src={book.thumbnail} alt={book.title} />
            <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>
                    <strong>Author(s):</strong> {book.authors.join(", ")}
                </Card.Text>
                <Button variant="primary" href={book.infoLink} target="_blank" rel="noopener noreferrer">
                    More Info
                </Button>
            </Card.Body>
        </Card>
    );
};

export default BookCard;
