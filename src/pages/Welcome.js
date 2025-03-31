import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaFilm, FaGlobe, FaPhone, FaUsers } from 'react-icons/fa'; 

const Welcome = () => {
    return (
        <Container fluid className="mt-4 px-4">
            <h1 className="text-center mb-4 welcome-title">¡Bienvenido a Cine Estudio!</h1>
            <p className="text-center mb-4 welcome-description" style={{ color: '#000000' }}>
                Tu plataforma para gestionar películas y series
            </p>
            <Row className="justify-content-center">
              
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/generos" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFilm size={50} className="icon" /> 
                            <Card.Title>Géneros</Card.Title>
                            <Card.Text>Administra los diferentes géneros de películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/directores" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaUsers size={50} className="icon" /> 
                            <Card.Title>Directores</Card.Title>
                            <Card.Text>Gestiona la información de los directores de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/paises" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaGlobe size={50} className="icon" />
                            <Card.Title>Países</Card.Title>
                            <Card.Text>Gestiona los países de origen de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/actores" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaUserCircle size={50} className="icon" />
                            <Card.Title>Actores</Card.Title>
                            <Card.Text>Administra la información de los actores de las películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/peliculas" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaFilm size={50} className="icon" /> 
                            <Card.Title>Películas</Card.Title>
                            <Card.Text>Gestiona el catálogo completo de películas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} className="mb-4">
                    <Card as={Link} to="/contacto" className="h-100 text-decoration-none welcome-card">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FaPhone size={50} className="icon" />
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