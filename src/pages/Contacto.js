import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';

const Contacto = () => {
    return (
        <Container fluid className="mt-4 px-4">
            <h1 className="text-center mb-4 welcome-title">Contáctanos</h1>
            <Row className="justify-content-center">
                {/* Fila 1 */}
                <Col lg={3} md={6} className="mb-4">
                    <Card className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFacebook size={40} className="icon" />
                            <Card.Title>Facebook</Card.Title>
                            <Card.Text>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    Visítanos en Facebook
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-4">
                    <Card className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaInstagram size={40} className="icon" />
                            <Card.Title>Instagram</Card.Title>
                            <Card.Text>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    Síguenos en Instagram
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {/* Fila 2 */}
                <Col lg={3} md={6} className="mb-4">
                    <Card className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaLinkedin size={40} className="icon" />
                            <Card.Title>LinkedIn</Card.Title>
                            <Card.Text>
                                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    Conéctate con nosotros en LinkedIn
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-4">
                    <Card className="h-100 text-decoration-none welcome-card">
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
