import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" className="navbar-bottom fixed-bottom">
            <Container className="justify-content-start" style={{ paddingLeft: '100px', paddingRight: '500px' }}>
                <Nav>
                    <Nav.Link 
                        href="https://www.facebook.com" 
                        target="_blank" 
                        className="text-white"
                        style={{ marginRight: '1px' }}  
                    >
                        <FaFacebook size={20} />
                    </Nav.Link>
                    <Nav.Link 
                        href="https://www.instagram.com" 
                        target="_blank" 
                        className="text-white"
                        style={{ marginRight: '1px' }} 
                    >
                        <FaInstagram size={20} />
                    </Nav.Link>
                    <Nav.Link 
                        href="https://www.linkedin.com" 
                        target="_blank" 
                        className="text-white"
                        style={{ marginRight: '1px' }}  
                    >
                        <FaLinkedin size={20} />
                    </Nav.Link>
                    <Nav.Link className="text-white">
                        <FaPhone size={20} /> +57 312 3456789 
                    </Nav.Link>
                </Nav>
            </Container>
            <div className="text-center text-white" style={{ padding: '10px 0', marginLeft: '15px', marginRight: '15px' }}>
                &copy; 2025 CineStudio. Todos los derechos reservados. 
            </div>
        </Navbar>
    );
};

export default Footer;
