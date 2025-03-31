import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaChevronRight } from 'react-icons/fa';

const NavigationBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Sesión cerrada exitosamente');
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
            <Container>
                <Navbar.Brand as={Link} to="/welcome">CineFicción Studios</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/peliculas">Películas</Nav.Link>
                        <Nav.Link as={Link} to="/directores">Directores</Nav.Link>
                        <Nav.Link as={Link} to="/generos">Géneros</Nav.Link>
                        <Nav.Link as={Link} to="/paises">Países</Nav.Link>
                        <Nav.Link as={Link} to="/actores">Actores</Nav.Link>
                        <Nav.Link as={Link} to="/contacto">Contáctanos</Nav.Link>
                    </Nav>
                    <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                        <span style={{ textDecoration: 'underline', color: 'red', marginRight: '5px', marginBottom: '2px' }}>Salir</span>
                        <FaChevronRight color="red" size={20} />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 