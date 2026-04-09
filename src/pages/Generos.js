import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Tag, 
    Layers, 
    CheckCircle,
    Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Generos = () => {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '' });
    const [loading, setLoading] = useState(true);

    const title = "GESTIÓN DE GÉNEROS";

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const [resGen, resPelis] = await Promise.all([
                api.get('/generos'),
                api.get('/peliculas')
            ]);
            
            const mapData = (res) => Array.isArray(res.data) ? res.data : (res.data.$values || []);
            setGeneros(mapData(resGen));
            setPeliculas(mapData(resPelis));
        } catch (error) {
            toast.error('Error de sincronización con la base de géneros');
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
            if (generoSeleccionado) {
                await api.put(`/generos/${generoSeleccionado.id}`, formData);
                toast.success('Clasificación actualizada');
            } else {
                await api.post('/generos', formData);
                toast.success('Nuevo género indexado');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Error en la persistencia de datos');
        }
    };

    const eliminarGenero = async (id) => {
        const enUso = peliculas.some(p => p.generoId === id);
        if (enUso) {
            toast.error('Restricción de integridad: Género vinculado a obras existentes');
            return;
        }

        if (window.confirm('¿Confirmar purga de esta categoría?')) {
            try {
                await api.delete(`/generos/${id}`);
                toast.success('Registro eliminado');
                fetchData();
            } catch (error) {
                toast.error('Fallo en la eliminación');
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
                        <Button className="btn-premium d-flex align-items-center gap-3" onClick={() => { setGeneroSeleccionado(null); setFormData({ nombre: '' }); setShowModal(true); }}>
                            <Plus size={18} /> Nuevo Género
                        </Button>
                    </motion.div>
                </div>
                
                <p className="text-dim extra-small text-uppercase mb-5 mt-1" style={{ letterSpacing: '8px', fontWeight: '400' }}>
                    <Layers size={12} className="text-primary me-2" /> Content Categorization Subsystem
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
                        {generos.map((gen) => (
                            <Col key={gen.id} xl={3} lg={4} md={6}>
                                <motion.div variants={itemVariants} className="movie-card-premium p-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                                            <Tag size={16} className="text-primary" />
                                        </div>
                                        <h4 className="m-0 text-white h6 fw-bold" style={{ letterSpacing: '1px' }}>{gen.nombre}</h4>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="icon-btn-premium text-info" onClick={() => { setGeneroSeleccionado(gen); setFormData({ nombre: gen.nombre }); setShowModal(true); }}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="icon-btn-premium text-danger" onClick={() => eliminarGenero(gen.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>
                )}

                <div className="mt-5 pt-5 opacity-30 text-center">
                    <Database size={24} className="text-primary mb-3" />
                    <p className="extra-small text-dim text-uppercase" style={{ letterSpacing: '4px' }}>Integridad Referential Activa</p>
                </div>
            </Container>

            <AnimatePresence>
                {showModal && (
                    <Modal show={true} onHide={() => setShowModal(false)} centered contentClassName="premium-modal shadow-lg">
                        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
                            <Modal.Title className="page-title h4 mb-0">
                                {generoSeleccionado ? 'Modificar Taxonomía' : 'Nueva Clasificación'}
                            </Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body className="p-4 pt-0">
                                <Form.Group>
                                    <Form.Label className="text-dim extra-small text-uppercase mb-3 fw-bold">Nombre del Género</Form.Label>
                                    <Form.Control 
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="Ej: Thriller Cyberpunk" 
                                        className="premium-input py-3" 
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="border-0 p-4">
                                <Button className="btn-premium w-100 py-3" type="submit">
                                    <CheckCircle size={18} className="me-2" /> Confirmar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Generos;