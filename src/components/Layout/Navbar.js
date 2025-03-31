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
                <Navbar.Brand as={Link} to="/welcome" style={{ color: '#add890', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                        src={process.env.PUBLIC_URL + '/images/logo.jpg'} 
                        alt="Logo" 
                        style={{ 
                            width: '35px', 
                            height: '35px', 
                            borderRadius: '50%', 
                            objectFit: 'cover'
                        }} 
                    />
                    Cine Estudio
                </Navbar.Brand>
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
                    <div className="d-flex align-items-center" style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '20px' }} onClick={handleLogout}>
                        <span style={{ color: '#ff6666', marginBottom: '2px', fontWeight: 'bold' }}>Log out</span>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 