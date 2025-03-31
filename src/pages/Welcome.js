import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserTie, FaFilm, FaUsers, FaVideo, FaGlobe, FaEnvelope } from 'react-icons/fa';
import '../App.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <h1 className="welcome-title">Bienvenido a SeriesApp</h1>
            <p className="welcome-description">Tu plataforma para gestionar películas y series</p>
            
            <Row className="justify-content-center g-4">
                <Col xs={12} sm={6} md={4}>
                    <Link to="/directores" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaUserTie className="icon" size={40} />
                                <Card.Title>Directores</Card.Title>
                                <Card.Text>Gestiona los directores de tus películas</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Link to="/generos" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaFilm className="icon" size={40} />
                                <Card.Title>Géneros</Card.Title>
                                <Card.Text>Administra los géneros cinematográficos</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Link to="/actores" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaUsers className="icon" size={40} />
                                <Card.Title>Actores</Card.Title>
                                <Card.Text>Gestiona el elenco de tus películas</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Link to="/peliculas" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaVideo className="icon" size={40} />
                                <Card.Title>Películas</Card.Title>
                                <Card.Text>Administra tu catálogo de películas</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Link to="/paises" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaGlobe className="icon" size={40} />
                                <Card.Title>Países</Card.Title>
                                <Card.Text>Gestiona los países de producción</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Link to="/contacto" className="text-decoration-none">
                        <Card className="card">
                            <Card.Body className="text-center">
                                <FaEnvelope className="icon" size={40} />
                                <Card.Title>Contáctanos</Card.Title>
                                <Card.Text>Ponte en contacto con nosotros</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    );
};

export default Welcome;