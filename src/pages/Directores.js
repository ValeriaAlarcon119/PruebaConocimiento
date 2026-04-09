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
    Video, 
    Globe, 
    CheckCircle,
    UserCheck,
    Film,
    Camera
} from 'lucide-react';
import '../App.css';

const TMDB_API_KEY = 'c7da69c9651075b9afc262f3671486a5';

// HELPER COMPONENT FOR DYNAMIC PHOTO FETCHING
const DirectorProfile = ({ nombre }) => {
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoto = async () => {
            if (!nombre) return;
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(nombre)}&language=es-ES&include_adult=false`);
                if (res.data.results && res.data.results.length > 0) {
                    const bestMatch = res.data.results.sort((a, b) => b.popularity - a.popularity)[0];
                    if (bestMatch.profile_path) {
                        setFoto(`https://image.tmdb.org/t/p/w500${bestMatch.profile_path}`);
                    }
                }
            } catch (err) {
                console.error("TMDB Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFoto();
    }, [nombre]);

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '50%', border: '4px solid rgba(255, 197, 24, 0.2)', background: 'rgba(255,255,255,0.02)', boxShadow: '0 0 30px rgba(245, 197, 24, 0.1)' }}>
            {loading ? (
                <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner size="sm" animation="grow" variant="primary" />
                </div>
            ) : foto ? (
                <motion.img 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={foto} 
                    alt={nombre} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100 opacity-20">
                    <Camera size={40} />
                </div>
            )}
        </div>
    );
};

const Directores = () => {
    const [directores, setDirectores] = useState([]);
    const [paises, setPaises] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [directorSeleccionado, setDirectorSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', paisId: '' });
    const [loading, setLoading] = useState(true);
    const [extraInfo, setExtraInfo] = useState({ bio: '', foto: '' });
    const [isFetchingBio, setIsFetchingBio] = useState(false);

    const title = "DIVISIÓN AUTORES";

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
            const [resDir, resPais, resPelis] = await Promise.all([
                api.get('/directores'),
                api.get('/paises'),
                api.get('/peliculas')
            ]);
            
            const mapData = (res) => Array.isArray(res.data) ? res.data : (res.data.$values || []);
            setDirectores(mapData(resDir));
            setPaises(mapData(resPais));
            setPeliculas(mapData(resPelis));
        } catch (error) {
            toast.error('Error de sincronización con el núcleo');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // FETCH DETAILED BIO FOR MODAL
    useEffect(() => {
        if (showModal && directorSeleccionado) {
            const fetchBio = async () => {
                setIsFetchingBio(true);
                try {
                    let searchRes = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(directorSeleccionado.nombre)}&language=es-ES&include_adult=false`);
                    
                    // FALLBACK: Intentar búsqueda parcial si falla la exacta
                    if ((!searchRes.data.results || searchRes.data.results.length === 0) && directorSeleccionado.nombre.split(' ').length > 1) {
                         const firstPart = directorSeleccionado.nombre.split(' ')[0];
                         searchRes = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(firstPart)}&language=es-ES&include_adult=false`);
                    }

                    if (searchRes.data.results && searchRes.data.results.length > 0) {
                        const sortedResults = searchRes.data.results.sort((a, b) => b.popularity - a.popularity);
                        const person = sortedResults[0];
                        const personId = person.id;
                        
                        // Intentar obtener detalles en español
                        let detailRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&language=es-ES`);
                        
                        // Si la bio está vacía, intentar en inglés
                        if (!detailRes.data.biography) {
                            const enRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&language=en-US`);
                            if (enRes.data.biography) {
                                detailRes.data.biography = enRes.data.biography;
                            }
                        }

                        // Si la bio está vacía, intentar generar una basada en créditos
                        if (!detailRes.data.biography) {
                            const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${TMDB_API_KEY}&language=es-ES`);
                            const topWorks = creditsRes.data.crew?.filter(c => c.job === 'Director').sort((a, b) => b.popularity - a.popularity).slice(0, 3).map(w => w.title || w.name).join(', ');
                            if (topWorks) {
                                detailRes.data.biography = `Cineasta visionario con una marca distintiva en el cine global, conocido principalmente por dirigir obras de gran impacto como ${topWorks}.`;
                            }
                        }

                        setExtraInfo({
                            bio: detailRes.data.biography || 'No hay biografía detallada disponible para este autor en los registros cinematográficos.',
                            foto: detailRes.data.profile_path ? `https://image.tmdb.org/t/p/w500${detailRes.data.profile_path}` : '',
                            nacimiento: detailRes.data.birthday || 'Información no disponible',
                            lugar: detailRes.data.place_of_birth || 'Origen no especificado',
                            popularidad: detailRes.data.popularity ? detailRes.data.popularity.toFixed(1) : '0'
                        });
                    } else {
                        setExtraInfo({ bio: 'El visionario solicitado no cuenta con registros biográficos oficiales en TMDb.', foto: '', nacimiento: 'N/A', lugar: 'N/A', popularidad: '0' });
                    }
                } catch (err) {
                    console.error("TMDB Detail Error", err);
                } finally {
                    setIsFetchingBio(false);
                }
            };
            fetchBio();
        } else {
            setExtraInfo({ bio: '', foto: '', nacimiento: '', lugar: '', popularidad: '' });
        }
    }, [showModal, directorSeleccionado]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: formData.nombre,
                paisId: parseInt(formData.paisId)
            };

            if (directorSeleccionado) {
                await api.put(`/directores/${directorSeleccionado.id}`, payload);
                toast.success('Autoría actualizada');
            } else {
                await api.post('/directores', payload);
                toast.success('Nuevo autor indexado');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Error en la persistencia');
        }
    };

    const eliminarDirector = async (id) => {
        if (window.confirm('¿Confirmar eliminación permanente de este registro?')) {
            try {
                await api.delete(`/directores/${id}`);
                toast.success('Registro purgado');
                fetchData();
            } catch (error) {
                toast.error('Error en la eliminación');
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
                        <Button className="btn-premium d-flex align-items-center gap-3" onClick={() => { setDirectorSeleccionado(null); setFormData({ nombre: '', paisId: '' }); setShowModal(true); }}>
                            <UserPlus size={18} /> Añadir Director
                        </Button>
                    </motion.div>
                </div>
                
                <p className="text-dim extra-small text-uppercase mb-5 mt-1" style={{ letterSpacing: '8px', fontWeight: '400' }}>
                    <Video size={12} className="text-primary me-2" /> Elite Visionary Indexing System
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="row g-4">
                        {directores.map((dir) => (
                            <Col key={dir.id} xl={3} lg={4} md={6}>
                                <motion.div variants={itemVariants} className="movie-card-premium p-4 text-center d-flex flex-column align-items-center gap-3" style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.4), rgba(2, 6, 23, 0.6))', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                                    <div style={{ width: '140px' }}>
                                        <DirectorProfile nombre={dir.nombre} />
                                    </div>
                                    
                                    <div className="w-100">
                                        <h3 className="mb-1 text-white fw-bold h5" style={{ letterSpacing: '1px' }}>{dir.nombre}</h3>
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                            <Globe size={10} className="text-primary" />
                                            <span className="text-dim extra-small text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                                                {paises.find(p => p.id === parseInt(dir.paisId))?.nombre || 'Internacional'}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex gap-2 justify-content-center pt-2 border-top border-secondary border-opacity-10">
                                            <button className="btn-link-premium text-info border-0 p-2 d-flex align-items-center gap-1" onClick={() => { setDirectorSeleccionado(dir); setFormData({ nombre: dir.nombre, paisId: dir.paisId }); setShowModal(true); }}>
                                                <Edit2 size={14} /> <span style={{ fontSize: '0.7rem' }}>PERFIL</span>
                                            </button>
                                            <button className="btn-link-premium text-danger border-0 p-2 d-flex align-items-center gap-1" onClick={() => eliminarDirector(dir.id)}>
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
                                {directorSeleccionado ? 'Expediente del Visionario' : 'Nuevo Archivo Autor'}
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
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-dim extra-small text-uppercase">Nombre del Visionario</Form.Label>
                                            <Form.Control name="nombre" value={formData.nombre} onChange={handleInputChange} required className="premium-input py-2" />
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
                                         <div className="mb-4">
                                             <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold" style={{ letterSpacing: '4px' }}>Biografía Oficial</Form.Label>
                                             {isFetchingBio ? (
                                                 <div className="py-3"><Spinner animation="grow" size="sm" variant="primary" /> <span className="text-dim ms-2">Recuperando datos de TMDB...</span></div>
                                             ) : (
                                                 <>
                                                     <div className="d-flex gap-4 mb-4 border-bottom border-secondary border-opacity-10 pb-3">
                                                         <div>
                                                             <p className="text-dim extra-small text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Nacimiento</p>
                                                             <p className="text-white small mb-0">{extraInfo.nacimiento}</p>
                                                         </div>
                                                         <div>
                                                             <p className="text-dim extra-small text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Lugar</p>
                                                             <p className="text-white small mb-0">{extraInfo.lugar}</p>
                                                         </div>
                                                         <div>
                                                             <p className="text-dim extra-small text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Popularidad</p>
                                                             <p className="text-primary small mb-0 fw-bold">★ {extraInfo.popularidad}</p>
                                                         </div>
                                                     </div>
                                                     <p className="text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.8', textAlign: 'justify' }}>
                                                         {extraInfo.bio}
                                                     </p>
                                                 </>
                                             )}
                                         </div>

                                        <div>
                                            <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold" style={{ letterSpacing: '4px' }}>Filmografía Asociada (EliteStream)</Form.Label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {directorSeleccionado ? (
                                                    peliculas.filter(p => parseInt(p.directorId) === parseInt(directorSeleccionado.id)).length > 0 ? (
                                                        peliculas.filter(p => parseInt(p.directorId) === parseInt(directorSeleccionado.id)).map(p => (
                                                            <Badge key={p.id} bg="transparent" className="glass-badge py-2 px-3 border-secondary border-opacity-50">
                                                                <Film size={12} className="me-2 text-primary" /> {p.titulo}
                                                            </Badge>
                                                        ))
                                                    ) : <span className="text-dim extra-small">No hay obras indexadas para este autor.</span>
                                                ) : <span className="text-dim extra-small">Inicia el registro para vincular obras.</span>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer className="border-0 p-4">
                                <Button className="btn-premium w-100 py-3" type="submit">
                                    <CheckCircle size={18} className="me-2" /> {directorSeleccionado ? 'Actualizar Expediente' : 'Validar Registro'}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Directores;