import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Phone, Monitor, Mail, Shield } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../../App.css';

const Footer = () => {
    return (
        <footer style={{ 
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(5,5,5,0) 100%)',
            padding: '100px 0 60px',
            marginTop: '80px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <Container className="custom-container" style={{ padding: '0 40px' }}>
                <Row className="g-5">
                    <Col lg={4}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <Monitor size={32} className="text-primary" />
                            <span className="brand-title h2 mb-0">ELITESTREAM PRO</span>
                        </div>
                        <p className="text-dim small mb-5" style={{ maxWidth: '300px', lineHeight: '2' }}>
                            La suite definitiva para la gestión de activos cinematográficos de alta post-producción. Diseñado para el cine de 2026.
                        </p>
                        <div className="d-flex gap-4">
                            <motion.a whileHover={{ y: -5, opacity: 1 }} href="#" className="text-dim opacity-50"><FaFacebook size={20} /></motion.a>
                            <motion.a whileHover={{ y: -5, opacity: 1 }} href="#" className="text-dim opacity-50"><FaInstagram size={20} /></motion.a>
                            <motion.a whileHover={{ y: -5, opacity: 1 }} href="#" className="text-dim opacity-50"><FaLinkedin size={20} /></motion.a>
                        </div>
                    </Col>
                    
                    <Col lg={2} md={4}>
                        <h5 className="nav-link-premium text-white mb-4">Navegación</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><a href="#/peliculas" className="text-dim extra-small text-decoration-none hover-white">Catálogo</a></li>
                            <li><a href="#/directores" className="text-dim extra-small text-decoration-none hover-white">Directores</a></li>
                            <li><a href="#/generos" className="text-dim extra-small text-decoration-none hover-white">Géneros</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={4}>
                        <h5 className="nav-link-premium text-white mb-4">Contacto</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="text-dim extra-small d-flex align-items-center gap-2"><Phone size={14} /> +57 312 3456789</li>
                            <li className="text-dim extra-small d-flex align-items-center gap-2"><Mail size={14} /> support@elitestream.pro</li>
                        </ul>
                    </Col>

                    <Col lg={3} md={4}>
                        <h5 className="nav-link-premium text-white mb-4">Seguridad</h5>
                        <div className="glass-effect p-4 border border-secondary" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="d-flex align-items-center gap-2 text-primary small fw-bold mb-2">
                                <Shield size={14} /> ARCHIVO PROTEGIDO
                            </div>
                            <p className="extra-small text-dim m-0">Protocolos TLS 1.4 activos.</p>
                        </div>
                    </Col>
                </Row>
                
                <div className="mt-5 pt-5 border-top border-secondary opacity-25 d-flex justify-content-between align-items-center">
                    <p className="extra-small text-dim m-0">&copy; 2026 ELITESTREAM PRO OS. TODOS LOS DERECHOS RESERVADOS.</p>
                    <p className="extra-small text-dim m-0">BUERAU VERITAS CERTIFIED CATALOG - v4.12.0</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
