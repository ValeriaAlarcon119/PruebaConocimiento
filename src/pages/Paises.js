import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Globe, 
    CheckCircle,
    Navigation,
    Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Paises = () => {
    const navigate = useNavigate();
    const [paises, setPaises] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [paisSeleccionado, setPaisSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '' });
    const [loading, setLoading] = useState(true);

    const title = "REGIONES GLOBALES";

    // ANIMATION VARIANTS
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const letterVariants = {
        hidden: { opacity: 0, scale: 1.1, filter: "blur(15px)", y: 10 },
        visible: { 
            opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const [resPais, resPelis] = await Promise.all([
                api.get('/paises'),
                api.get('/peliculas')
            ]);
            
            const mapData = (res) => Array.isArray(res.data) ? res.data : (res.data.$values || []);
            setPaises(mapData(resPais));
            setPeliculas(mapData(resPelis));
        } catch (error) {
            toast.error('Error de conexión con el satélite de regiones');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (paisSeleccionado) {
                await api.put(`/paises/${paisSeleccionado.id}`, formData);
                toast.success('Región geográfica actualizada');
            } else {
                await api.post('/paises', formData);
                toast.success('Nueva región anexada');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Error en la transferencia de datos');
        }
    };

    const eliminarPais = async (id) => {
        const enUso = peliculas.some(p => p.paisId === id);
        if (enUso) {
            toast.error('Vínculo detectado: Esta región posee producciones activas');
            return;
        }

        if (window.confirm('¿Desvincular esta región permanentemente?')) {
            try {
                await api.delete(`/paises/${id}`);
                toast.success('Jurisdicción eliminada');
                fetchData();
            } catch (error) {
                toast.error('Fallo en la desvinculación');
            }
        }
    };

    return (
        <div style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '10px 0' }}>
            <Container className="custom-container">
                <div className="header-flex-mobile d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-4" style={{ marginTop: '-10px' }}>
                    <motion.div initial="hidden" animate="visible" variants={titleVariants} className="d-flex flex-wrap gap-1">
                        {title.split("").map((char, index) => (
                            <motion.span 
                                key={index} 
                                variants={letterVariants}
                                className="page-title mb-0" 
                                style={{ 
                                    fontSize: '3.5rem', 
                                    fontWeight: '900', 
                                    letterSpacing: '-2px', 
                                    display: 'inline-block',
                                    lineHeight: '1'
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="btn-premium d-flex align-items-center gap-3" onClick={() => { setPaisSeleccionado(null); setFormData({ nombre: '' }); setShowModal(true); }}>
                            <Plus size={18} /> Añadir Región
                        </Button>
                    </motion.div>
                </div>
                
                <p className="text-dim extra-small text-uppercase mb-5 mt-1" style={{ letterSpacing: '8px', fontWeight: '400' }}>
                    <Compass size={12} className="text-primary me-2" /> Global Production Origin Mapping
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
                        {paises.map((pais) => (
                            <Col key={pais.id} xl={3} lg={4} md={6}>
                                <motion.div variants={itemVariants} className="movie-card-premium p-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                            <Globe size={16} className="text-primary" />
                                        </div>
                                        <h4 className="m-0 text-white h6 fw-bold" style={{ letterSpacing: '1px' }}>{pais.nombre}</h4>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="icon-btn-premium text-info" onClick={() => { setPaisSeleccionado(pais); setFormData({ nombre: pais.nombre }); setShowModal(true); }}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="icon-btn-premium text-danger" onClick={() => eliminarPais(pais.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>
                )}

                <div className="mt-5 pt-5 opacity-30 text-center">
                    <Navigation size={24} className="text-primary mb-3" />
                    <p className="extra-small text-dim text-uppercase" style={{ letterSpacing: '4px' }}>Geolocalización Cinematográfica Activa</p>
                </div>
            </Container>

            <AnimatePresence>
                {showModal && (
                    <Modal show={true} onHide={() => setShowModal(false)} centered contentClassName="premium-modal shadow-lg">
                        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
                            <Modal.Title className="page-title h4 mb-0">
                                {paisSeleccionado ? 'Configuración de Región' : 'Nuevo Nodo Geográfico'}
                            </Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body className="p-4 pt-0">
                                <Form.Group>
                                    <Form.Label className="text-dim extra-small text-uppercase mb-3 fw-bold">Nombre de la Región / País</Form.Label>
                                    <Form.Control 
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="Ej: Reino Unido" 
                                        className="premium-input py-3" 
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="border-0 p-4">
                                <Button className="btn-premium w-100 py-3" type="submit">
                                    <CheckCircle size={18} className="me-2" /> Validar Nodo
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Paises;