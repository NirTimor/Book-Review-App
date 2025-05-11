import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import BookCard from "./BookCard";

const BookList = ({ books }) => {
  return (
    <Container>
      <Row className="g-4">
        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book.id} md={4}>
              <BookCard book={book} />
            </Col>
          ))
        ) : (
          <p className="text-center">No books found.</p>
        )}
      </Row>
    </Container>
  );
};

export default BookList;
