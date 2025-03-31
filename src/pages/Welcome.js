import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaFilm, FaGlobe, FaPhone } from 'react-icons/fa'; // Importa los íconos

const Welcome = () => {
    return (
        <Container fluid className="mt-4 px-4">
            <h1 className="text-center mb-4 welcome-title">¡Bienvenido a Cine Estudio!</h1>
            <p className="text-center mb-4 welcome-description">
                Tu plataforma para gestionar toda la información sobre películas y series animadas.
            </p>
            <Row className="justify-content-center">
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/directores" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaUser size={50} className="icon" /> {/* Icono de personas para Directores */}
                            <Card.Title>Directores</Card.Title>
                            <Card.Text>Gestiona la información de los directores de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/generos" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFilm size={50} className="icon" /> {/* Icono de claqueta para Géneros */}
                            <Card.Title>Géneros</Card.Title>
                            <Card.Text>Administra los diferentes géneros de películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/paises" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaGlobe size={50} className="icon" /> {/* Icono de globo terráqueo para Países */}
                            <Card.Title>Países</Card.Title>
                            <Card.Text>Gestiona los países de origen de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/actores" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaUser size={50} className="icon" /> {/* Icono de personas para Actores */}
                            <Card.Title>Actores</Card.Title>
                            <Card.Text>Administra la información de los actores de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/peliculas" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFilm size={50} className="icon" /> {/* Icono de películas */}
                            <Card.Title>Películas</Card.Title>
                            <Card.Text>Gestiona el catálogo completo de películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/contacto" className="h-100 text-decoration-none">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaPhone size={50} className="icon" /> {/* Icono de teléfono para Contacto */}
                            <Card.Title>Contáctanos</Card.Title>
                            <Card.Text>Si tienes preguntas, no dudes en contactarnos.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Welcome;