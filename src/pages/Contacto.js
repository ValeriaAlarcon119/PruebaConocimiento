import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';

const Contacto = () => {
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Contáctanos</h1>
            <Card className="contact-card">
                <Card.Body>
                    <Card.Title>Estamos aquí para ayudarte</Card.Title>
                    <Card.Text>
                        Si tienes preguntas, no dudes en contactarnos.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Row className="justify-content-center">
                <Col md={5} className="mb-4">
                    <Card className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFacebook size={40} className="icon" />
                            <Card.Title>Facebook</Card.Title>
                            <Card.Text>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                    Visítanos en Facebook
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5} className="mb-4">
                    <Card className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaInstagram size={40} className="icon" />
                            <Card.Title>Instagram</Card.Title>
                            <Card.Text>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                    Síguenos en Instagram
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5} className="mb-4">
                    <Card className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaLinkedin size={40} className="icon" />
                            <Card.Title>LinkedIn</Card.Title>
                            <Card.Text>
                                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                    Conéctate con nosotros en LinkedIn
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5} className="mb-4">
                    <Card className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaPhone size={40} className="icon" />
                            <Card.Title>Teléfono</Card.Title>
                            <Card.Text>
                                <a href="tel:+573123456789" className="text-decoration-none">
                                    +57 312 3456789
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contacto;
