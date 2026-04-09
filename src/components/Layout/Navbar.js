import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { LogOut, Monitor, Settings, Search, Menu } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import '../../App.css';

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { globalSearchQuery, setGlobalSearchQuery } = useSearch();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
            setExpanded(false);
        } else {
            setHidden(false);
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Desconexión finalizada. Sesión cerrada.");
        navigate('/login');
    };

    // Auto-navigate to movies if searching from elsewhere
    const handleSearchChange = (e) => {
        setGlobalSearchQuery(e.target.value);
        if (location.pathname !== '/peliculas' && e.target.value.length > 0) {
            navigate('/peliculas');
        }
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
            <Navbar expanded={expanded} onToggle={setExpanded} expand="lg" className="navbar-premium">
                <Container fluid className="px-5 px-md-5">
                    <Navbar.Brand as={Link} to="/welcome" onClick={() => setExpanded(false)} className="d-flex align-items-center gap-3">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                            <Monitor size={28} className="text-primary" />
                        </motion.div>
                        <span className="brand-title h3 mb-0 d-none d-sm-block">ELITESTREAM PRO</span>
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
                        <Menu className="text-white" />
                    </Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto gap-4 py-4 py-lg-0">
                            <Nav.Link as={Link} to="/peliculas" onClick={() => setExpanded(false)} className="nav-link-premium">Películas</Nav.Link>
                            <Nav.Link as={Link} to="/directores" onClick={() => setExpanded(false)} className="nav-link-premium">Directores</Nav.Link>
                            <Nav.Link as={Link} to="/generos" onClick={() => setExpanded(false)} className="nav-link-premium">Géneros</Nav.Link>
                            <Nav.Link as={Link} to="/actores" onClick={() => setExpanded(false)} className="nav-link-premium">Actores</Nav.Link>
                            <Nav.Link as={Link} to="/contacto" onClick={() => setExpanded(false)} className="nav-link-premium">Contacto</Nav.Link>
                        </Nav>
                        
                        <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
                            {/* INLINE GLOBAL SEARCH */}
                            <div className="search-container-navbar position-relative w-100" style={{ maxWidth: '250px' }}>
                                <Form.Control 
                                    type="text"
                                    placeholder="BUSCAR PELÍCULA..."
                                    className="premium-input-navbar py-2 ps-4"
                                    value={globalSearchQuery}
                                    onChange={handleSearchChange}
                                    style={{ 
                                        fontSize: '0.65rem', 
                                        letterSpacing: '2px', 
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        borderRadius: '4px',
                                        color: '#fff'
                                    }}
                                />
                                <Search size={12} className="position-absolute start-0 top-50 translate-middle-y ms-2 text-primary" />
                            </div>

                            <motion.div whileHover={{ scale: 1.1 }} className="text-dim extra-small d-flex align-items-center gap-2 cursor-pointer d-none d-lg-flex">
                                <Settings size={14} /> SISTEMA
                            </motion.div>
                            
                            <Button 
                                onClick={() => { handleLogout(); setExpanded(false); }} 
                                className="btn-premium d-flex align-items-center justify-content-center gap-2 px-4 w-100 w-lg-auto"
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