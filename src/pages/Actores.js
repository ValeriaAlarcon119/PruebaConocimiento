import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Modal, Form, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'sonner';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Plus, 
    UserPlus, 
    Trash2, 
    Edit2, 
    Globe, 
    CheckCircle,
    Film,
    Camera,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const TMDB_API_KEY = 'c7da69c9651075b9afc262f3671486a5';

// HELPER COMPONENT FOR DYNAMIC PHOTO FETCHING
const ActorProfilePhoto = ({ nombre, apellido }) => {
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoto = async () => {
            try {
                const fullName = `${nombre} ${apellido}`;
                const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(fullName)}&language=es-ES`);
                if (res.data.results && res.data.results[0]?.profile_path) {
                    setFoto(`https://image.tmdb.org/t/p/w500${res.data.results[0].profile_path}`);
                }
            } catch (err) {
                console.error("TMDB Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFoto();
    }, [nombre, apellido]);

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '50%', border: '4px solid rgba(59, 130, 246, 0.1)', background: 'rgba(255,255,255,0.02)' }}>
            {loading ? (
                <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner size="sm" animation="grow" variant="primary" />
                </div>
            ) : foto ? (
                <img src={foto} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100 opacity-20">
                    <Camera size={40} />
                </div>
            )}
        </div>
    );
};

const Actores = () => {
    const navigate = useNavigate();
    const [actores, setActores] = useState([]);
    const [paises, setPaises] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [actorSeleccionado, setActorSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', apellido: '', paisId: '' });
    const [loading, setLoading] = useState(true);
    const [extraInfo, setExtraInfo] = useState({ bio: '', foto: '' });
    const [isFetchingBio, setIsFetchingBio] = useState(false);

    const title = "ELENCO ÉLITE";

    // ANIMATION VARIANTS
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const letterVariants = {
        hidden: { opacity: 0, scale: 1.1, filter: "blur(15px)", y: 10 },
        visible: { 
            opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, scale: 1, y: 0, 
            transition: { type: "spring", stiffness: 100, damping: 12 } 
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const [resAct, resPais, resPelis] = await Promise.all([
                api.get('/actores'),
                api.get('/paises'),
                api.get('/peliculas')
            ]);
            
            const mapData = (res) => Array.isArray(res.data) ? res.data : (res.data.$values || []);
            setActores(mapData(resAct));
            setPaises(mapData(resPais));
            setPeliculas(mapData(resPelis));
        } catch (error) {
            toast.error('Error de sincronización con el elenco');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // FETCH DETAILED BIO FOR MODAL
    useEffect(() => {
        if (showModal && actorSeleccionado) {
            const fetchBio = async () => {
                setIsFetchingBio(true);
                try {
                    const fullName = `${actorSeleccionado.nombre} ${actorSeleccionado.apellido}`;
                    const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(fullName)}&language=es-ES`);
                    if (res.data.results && res.data.results[0]) {
                        const personId = res.data.results[0].id;
                        const detailRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&language=es-ES`);
                        setExtraInfo({
                            bio: detailRes.data.biography || 'Sin registros biográficos en el archivo central.',
                            foto: `https://image.tmdb.org/t/p/w500${detailRes.data.profile_path}`
                        });
                    }
                } catch (err) {
                    console.error("TMDB Detail Error", err);
                } finally {
                    setIsFetchingBio(false);
                }
            };
            fetchBio();
        } else {
            setExtraInfo({ bio: '', foto: '' });
        }
    }, [showModal, actorSeleccionado]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                paisId: parseInt(formData.paisId)
            };

            if (actorSeleccionado) {
                await api.put(`/actores/${actorSeleccionado.id}`, payload);
                toast.success('Perfil de actor actualizado');
            } else {
                await api.post('/actores', payload);
                toast.success('Actor indexado en el elenco');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Error en la persistencia del elenco');
        }
    };

    const eliminarActor = async (id) => {
        const actorEnUso = peliculas.some(p => p.actoresIds?.includes(id.toString()) || p.actoresIds?.includes(id));
        if (actorEnUso) {
            toast.error('Imposible eliminar: El actor está vinculado a una o más obras.');
            return;
        }

        if (window.confirm('¿Confirmar eliminación permanente de este registro?')) {
            try {
                await api.delete(`/actores/${id}`);
                toast.success('Actor purgado del sistema');
                fetchData();
            } catch (error) {
                toast.error('Error en la eliminación');
            }
        }
    };

    return (
        <div style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '10px 0' }}>
            <Container className="custom-container">
                <div className="d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-4" style={{ marginTop: '-10px' }}>
                    <motion.div initial="hidden" animate="visible" variants={titleVariants} className="d-flex gap-1">
                        {title.split("").map((char, index) => (
                            <motion.span 
                                key={index} 
                                variants={letterVariants}
                                className="page-title mb-0" 
                                style={{ 
                                    fontSize: '4.5rem', 
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
                        <Button className="btn-premium d-flex align-items-center gap-3" onClick={() => { setActorSeleccionado(null); setFormData({ nombre: '', apellido: '', paisId: '' }); setShowModal(true); }}>
                            <UserPlus size={18} /> Agregar Actor
                        </Button>
                    </motion.div>
                </div>
                
                <p className="text-dim extra-small text-uppercase mb-5 mt-1" style={{ letterSpacing: '8px', fontWeight: '400' }}>
                    <Users size={12} className="text-primary me-2" /> Global Talent Asset Repository
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="row g-4">
                        {actores.map((actor) => (
                            <Col key={actor.id} xl={3} lg={4} md={6}>
                                <motion.div variants={itemVariants} className="movie-card-premium p-4 text-center d-flex flex-column align-items-center gap-3" style={{ background: 'linear-gradient(145deg, rgba(8, 20, 48, 0.4), rgba(2, 6, 23, 0.6))', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '16px' }}>
                                    <div style={{ width: '130px' }}>
                                        <ActorProfilePhoto nombre={actor.nombre} apellido={actor.apellido} />
                                    </div>
                                    
                                    <div className="w-100">
                                        <h3 className="mb-1 text-white fw-bold h5" style={{ letterSpacing: '1px' }}>{actor.nombre} {actor.apellido}</h3>
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                            <Globe size={10} className="text-primary" />
                                            <span className="text-dim extra-small text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                                                {paises.find(p => p.id === parseInt(actor.paisId))?.nombre || 'Internacional'}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex gap-2 justify-content-center pt-2 border-top border-secondary border-opacity-10">
                                            <button className="btn-link-premium text-info border-0 p-2 d-flex align-items-center gap-1" onClick={() => { setActorSeleccionado(actor); setFormData({ nombre: actor.nombre, apellido: actor.apellido, paisId: actor.paisId }); setShowModal(true); }}>
                                                <Edit2 size={14} /> <span style={{ fontSize: '0.7rem' }}>PERFIL</span>
                                            </button>
                                            <button className="btn-link-premium text-danger border-0 p-2 d-flex align-items-center gap-1" onClick={() => eliminarActor(actor.id)}>
                                                <Trash2 size={14} /> <span style={{ fontSize: '0.7rem' }}>ELIMINAR</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>
                )}
            </Container>

            <AnimatePresence>
                {showModal && (
                    <Modal show={true} onHide={() => setShowModal(false)} centered size="xl" contentClassName="premium-modal shadow-lg">
                        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
                            <Modal.Title className="page-title h3 mb-0" style={{ fontSize: '2rem' }}>
                                {actorSeleccionado ? 'Expediente del Actor' : 'Nuevo Registro de Elenco'}
                            </Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body className="p-4 pt-0">
                                <Row className="g-5">
                                    <Col lg={4}>
                                        <div className="mb-4">
                                            <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                                                {extraInfo.foto ? (
                                                    <img src={extraInfo.foto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="d-flex align-items-center justify-content-center h-100 opacity-20">
                                                        <Camera size={60} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-dim extra-small text-uppercase">Nombre</Form.Label>
                                            <Form.Control name="nombre" value={formData.nombre} onChange={handleInputChange} required className="premium-input py-2" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-dim extra-small text-uppercase">Apellido</Form.Label>
                                            <Form.Control name="apellido" value={formData.apellido} onChange={handleInputChange} required className="premium-input py-2" />
                                        </Form.Group>
                                        <Form.Group className="mb-0">
                                            <Form.Label className="text-dim extra-small text-uppercase">Región de Origen</Form.Label>
                                            <Form.Select name="paisId" value={formData.paisId} onChange={handleInputChange} required className="premium-input py-2">
                                                <option value="">Seleccionar Origen...</option>
                                                {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col lg={8}>
                                        <div className="mb-5">
                                            <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold" style={{ letterSpacing: '4px' }}>Trayectoria / Biografía</Form.Label>
                                            {isFetchingBio ? (
                                                <div className="py-3"><Spinner animation="grow" size="sm" variant="primary" /> <span className="text-dim ms-2">Accediendo a TMDB Intelligence...</span></div>
                                            ) : (
                                                <p className="text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.8', textAlign: 'justify' }}>
                                                    {extraInfo.bio}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold" style={{ letterSpacing: '4px' }}>Filmografía Asociada (EliteStream)</Form.Label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {actorSeleccionado ? (
                                                    peliculas.filter(p => p.actoresIds?.includes(actorSeleccionado.id.toString()) || p.actoresIds?.includes(actorSeleccionado.id)).length > 0 ? (
                                                        peliculas.filter(p => p.actoresIds?.includes(actorSeleccionado.id.toString()) || p.actoresIds?.includes(actorSeleccionado.id)).map(p => (
                                                            <Badge key={p.id} bg="transparent" className="glass-badge py-2 px-3 border-secondary border-opacity-50">
                                                                <Film size={12} className="me-2 text-primary" /> {p.titulo}
                                                            </Badge>
                                                        ))
                                                    ) : <span className="text-dim extra-small">No hay obras indexadas para este actor.</span>
                                                ) : <span className="text-dim extra-small">Inicia el registro para vincular obras.</span>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer className="border-0 p-4">
                                <Button className="btn-premium w-100 py-3" type="submit">
                                    <CheckCircle size={18} className="me-2" /> {actorSeleccionado ? 'Actualizar Expediente' : 'Validar Actor'}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Actores;