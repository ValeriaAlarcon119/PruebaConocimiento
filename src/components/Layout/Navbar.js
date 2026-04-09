import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { LogOut, Monitor, Settings, Search, Menu } from 'lucide-react';
import '../../App.css';

const NavigationBar = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Desconexión finalizada. Sesión cerrada.");
        navigate('/login');
    };

    return (
        <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ position: 'sticky', top: 0, zIndex: 1000 }}
        >
            <Navbar expand="lg" className="navbar-premium">
                <Container fluid className="px-5">
                    <Navbar.Brand as={Link} to="/welcome" className="d-flex align-items-center gap-3">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                            <Monitor size={28} className="text-primary" />
                        </motion.div>
                        <span className="brand-title h3 mb-0">ELITESTREAM PRO</span>
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
                        <Menu className="text-white" />
                    </Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto gap-4">
                            <Nav.Link as={Link} to="/peliculas" className="nav-link-premium">Películas</Nav.Link>
                            <Nav.Link as={Link} to="/directores" className="nav-link-premium">Directores</Nav.Link>
                            <Nav.Link as={Link} to="/generos" className="nav-link-premium">Géneros</Nav.Link>
                            <Nav.Link as={Link} to="/actores" className="nav-link-premium">Actores</Nav.Link>
                            <Nav.Link as={Link} to="/contacto" className="nav-link-premium">Contacto</Nav.Link>
                        </Nav>
                        
                        <div className="d-flex align-items-center gap-4">
                            <motion.div whileHover={{ scale: 1.1 }} className="text-dim extra-small d-flex align-items-center gap-2 cursor-pointer">
                                <Search size={14} /> BÚSQUEDA
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} className="text-dim extra-small d-flex align-items-center gap-2 cursor-pointer">
                                <Settings size={14} /> SISTEMA
                            </motion.div>
                            <Button 
                                onClick={handleLogout} 
                                className="btn-premium d-flex align-items-center gap-2 px-4"
                                style={{ padding: '12px 25px !important' }}
                            >
                                <LogOut size={16} /> SALIR
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </motion.div>
    );
};

export default NavigationBar;