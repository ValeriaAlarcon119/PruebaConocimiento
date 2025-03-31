import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" className="navbar-bottom fixed-bottom">
            <Container className="justify-content-start">
                <Nav>
                    <Nav.Link href="https://www.facebook.com" target="_blank" className="text-white">
                        <FaFacebook size={20} />
                    </Nav.Link>
                    <Nav.Link href="https://www.instagram.com" target="_blank" className="text-white">
                        <FaInstagram size={20} />
                    </Nav.Link>
                    <Nav.Link href="https://www.linkedin.com" target="_blank" className="text-white">
                        <FaLinkedin size={20} />
                    </Nav.Link>
                    <Nav.Link className="text-white">
                        <FaPhone size={20} /> +57 312 3456789 {/* Número de teléfono actualizado */}
                    </Nav.Link>
                </Nav>
            </Container>
            <div className="text-center text-white" style={{ padding: '10px 0' }}>
                &copy; 2025 CineStudio. Todos los derechos reservados. {/* Derechos de autor */}
            </div>
        </Navbar>
    );
};

export default Footer;
