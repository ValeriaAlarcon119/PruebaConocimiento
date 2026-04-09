import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Badge, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import confetti from 'canvas-confetti';
import { 
    Plus, 
    Edit3, 
    Eye, 
    Sparkles, 
    Search, 
    Film, 
    Clapperboard, 
    CheckCircle2,
    Trash2, 
    Edit2, 
    Globe, 
    CheckCircle,
    Camera,
    Users
} from 'lucide-react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';

const TMDB_API_KEY = 'c7da69c9651075b9afc262f3671486a5';

const Peliculas = () => {
    const navigate = useNavigate();
    const { globalSearchQuery, setGlobalSearchQuery } = useSearch();
    const [peliculas, setPeliculas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        resena: '',
        portada: '',
        trailer: '',
        generoId: '',
        paisId: '1',
        directorId: '',
        actoresIds: []
    });
    const [actores, setActores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [filterQuery, setFilterQuery] = useState(''); // FOR GLOBAL FILTER
    const [tmdbSuggestions, setTmdbSuggestions] = useState([]); // FOR LIVE SUGGESTIONS IN MODAL

    // SMARTER STAGGERED CASCADE VARIANTS
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1, // FASTER: One by one but snappy
                delayChildren: 0.1
            } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: "spring",
                stiffness: 70, 
                damping: 15,
                duration: 0.8
            } 
        }
    };

    // LETTER BY LETTER REVEAL
    const title = "ARCHIVO ÉLITE";
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            }
        }
    };
    const letterVariants = {
        hidden: { opacity: 0, scale: 1.1, filter: "blur(15px)", y: 10 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            filter: "blur(0px)", 
            y: 0,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPelis, resGen, resDir, resAct] = await Promise.all([
                api.get('/peliculas'),
                api.get('/generos'),
                api.get('/directores'),
                api.get('/actores')
            ]);
            const mapData = (res) => Array.isArray(res.data) ? res.data : (res.data.$values || []);
            setPeliculas(mapData(resPelis));
            setGeneros(mapData(resGen));
            setDirectores(mapData(resDir));
            setActores(mapData(resAct));
        } catch (error) {
            toast.error('Error de sincronización');
        } finally {
            setLoading(false);
        }
    };

    const searchTMDB = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=es-ES`);
            if (res.data.results.length > 0) {
                const film = res.data.results[0];
                selectFilmFromTmdb(film);
            }
        } catch (error) {
            toast.error('Fallo en TMDb Intelligence');
        } finally {
            setIsSearching(false);
        }
    };

    const selectFilmFromTmdb = async (film) => {
        setIsSearching(true);
        try {
            const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${film.id}/videos?api_key=${TMDB_API_KEY}`);
            const trailer = videoRes.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || '';

            setFormData({
                ...formData,
                titulo: film.title,
                resena: film.overview ? `SINOPSIS OFICIAL: ${film.overview}\n\n[ANÁLISIS DE OBRA]: Esta producción destaca por su profundidad técnica y narrativa, ofreciendo una visión única del cine contemporáneo.` : 'Descripción reservada para miembros de la red EliteStream.',
                portada: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                trailer: trailer
            });
            setTmdbSuggestions([]);
            setSearchQuery(film.title);
            toast.success('Metadatos TMDb sincronizados');
        } catch (error) {
            toast.error('Error al sincronizar película');
        } finally {
            setIsSearching(false);
        }
    };

    // LIVE SUGGESTIONS EFFECT
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 2 && showModal) {
                try {
                    const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=es-ES`);
                    setTmdbSuggestions(res.data.results.slice(0, 5));
                } catch (e) {}
            } else {
                setTmdbSuggestions([]);
            }
        };
        const timer = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, showModal]);

    const generarReseñaIA = () => {
        if (!formData.titulo) return;
        setIsGenerating(true);
        setTimeout(() => {
            const reviews = [
                `CRÍTICA ELITESTREAM: "${formData.titulo}" se erige como una catedral cinematográfica en la era moderna. Bajo una dirección técnica impecable, la obra teje una narrativa de texturas profundas donde cada fotograma parece una pintura al óleo en movimiento. Es una experiencia visceral que no solo entretiene, sino que desafía los sentidos del espectador.`,
                `VISIÓN ELITE: En este despliegue de virtuosismo visual, "${formData.titulo}" explora las fronteras de la psique humana con una elegancia reservada solo para los grandes clásicos. La interpretación se siente orgánica, cruda y magnética, elevando el guion a un nivel de trascendencia donde la trama y la emoción se funden en un solo aliento.`,
                `ANÁLISIS PRO: Con una arquitectura narrativa audaz, "${formData.titulo}" rompe el molde de los géneros convencionales para ofrecernos un viaje introspectivo hacia lo desconocido. La sofisticación del montaje y la paleta de colores midnight-gold crean una atmósfera hipnótica de la cual es imposible escapar.`,
                `RESUMEN EJECUTIVO: La pieza "${formData.titulo}" es un triunfo absoluto de la técnica sobre la forma. Cada secuencia está meticulosamente diseñada para provocar una catarsis emocional en el espectador, apoyada por una banda sonora que subraya la solemnidad de cada diálogo. Representa el estándar de oro de EliteStream.`
            ];
            const selected = reviews[Math.floor(Math.random() * reviews.length)];
            setFormData(prev => ({ ...prev, resena: selected }));
            setIsGenerating(false);
            toast.success('Análisis Cinematográfico optimizado por IA Elite');
        }, 1500);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                generoId: parseInt(formData.generoId),
                paisId: parseInt(formData.paisId),
                directorId: parseInt(formData.directorId)
            };

            if (peliculaSeleccionada) {
                await api.put(`/peliculas/${peliculaSeleccionada.id}`, formData);
                toast.success('Metadatos actualizados');
            } else {
                await api.post('/peliculas', formData);
                toast.success('Nueva obra indexada con éxito');
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f5c518', '#ffffff', '#3b82f6']
                });
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Error al persistir');
        }
    };

    const handleAutoIndex = async () => {
        setLoading(true);
        try {
            toast.loading('Analizando tendencias cinematográficas...');
            const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`);
            const popular = res.data.results.slice(0, 12); // Index 12 movies
            
            for (const film of popular) {
                const payload = {
                    titulo: film.title,
                    resena: film.overview || 'Sin descripción disponible.',
                    portada: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                    trailer: '',
                    generoId: generos[0]?.id || 1,
                    directorId: directores[0]?.id || 1,
                    paisId: 1
                };
                await api.post('/peliculas', payload);
            }
            
            toast.dismiss();
            toast.success(`${popular.length} nuevas obras maestras indexadas en el sistema.`);
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 }
            });
            fetchData();
        } catch (error) {
            toast.error('Error durante la indexación masiva');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '10px 0' }}>
            <Container className="custom-container">
                <div className="header-flex-mobile d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-4" style={{ marginTop: '-10px' }}>
                    <div className="d-flex flex-column gap-3 w-100">
                        <motion.div initial="hidden" animate="visible" variants={titleVariants} className="d-flex flex-wrap gap-1">
                            {title.split("").map((char, index) => (
                                <motion.span 
                                    key={index} 
                                    variants={letterVariants}
                                    className="page-title mb-0" 
                                    style={{ 
                                        fontSize: '5rem', 
                                        fontWeight: '900', 
                                        letterSpacing: '5px', 
                                        display: 'inline-block',
                                        lineHeight: '1'
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>
                        
                        <div className="d-flex gap-3 align-items-center w-50 w-mobile-100">
                            <Search size={18} className="text-primary" />
                            <Form.Control 
                                type="text" 
                                placeholder="FILTRAR POR TÍTULO EN TIEMPO REAL..." 
                                className="premium-input py-2" 
                                style={{ fontSize: '0.7rem', letterSpacing: '2px', borderBottom: '1px solid var(--primary)' }}
                                value={globalSearchQuery}
                                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 border-opacity-10 text-primary"
                                onClick={handleAutoIndex}
                                style={{ background: 'rgba(59, 130, 246, 0.05)', fontSize: '0.8rem' }}
                            >
                                <Sparkles size={16} /> Auto-Index
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="btn-premium d-flex align-items-center gap-3" onClick={() => { setPeliculaSeleccionada(null); setFormData({titulo:'', resena:'', portada:'', trailer:'', generoId:'', directorId:'', actoresIds:[], paisId:'1'}); setShowModal(true); setTmdbSuggestions([]); }}>
                                <Plus size={18} /> Indexar Obra
                            </Button>
                        </motion.div>
                    </div>
                </div>
                
                <p className="text-dim extra-small text-uppercase mb-5 mt-1" style={{ letterSpacing: '8px', fontWeight: '400' }}>
                    <Film size={12} className="text-primary me-2" /> High-End Cinematic Asset Management
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants} 
                        initial="hidden" 
                        animate="visible" 
                        className="row g-5 d-flex justify-content-center"
                    >
                        {peliculas
                          .filter(p => !globalSearchQuery || p.titulo.toLowerCase().startsWith(globalSearchQuery.toLowerCase()))
                          .map(p => (
                            <Col key={p.id} xl={3} lg={4} md={6}>
                                <motion.div variants={itemVariants}>
                                    <Tilt 
                                        tiltMaxAngleX={15} 
                                        tiltMaxAngleY={15} 
                                        perspective={1000} 
                                        scale={1.05} 
                                        transitionSpeed={1500}
                                        gyroscope={true}
                                        className="movie-card-premium"
                                    >
                                        <div className="card-img-container" style={{ borderRadius: '12px' }}>
                                            <img src={p.portada || 'https://via.placeholder.com/500x750?text=No+Poster'} alt={p.titulo} style={{ borderRadius: '12px' }} />
                                            <div className="movie-overlay" style={{ borderRadius: '12px' }}></div>
                                            
                                            <div className="position-absolute bottom-0 start-0 p-4 w-100" style={{ zIndex: 10 }}>
                                                <Badge bg="transparent" className="glass-badge mb-3 d-inline-block">
                                                    {generos.find(g => g.id === parseInt(p.generoId))?.nombre || 'General'}
                                                </Badge>
                                                <h3 className="movie-title mb-1" style={{ fontSize: '1.4rem', fontWeight: '800' }}>{p.titulo}</h3>
                                                <div className="text-dim extra-small mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.65rem' }}>
                                                    <Clapperboard size={10} className="text-primary" /> 
                                                    <span>{directores.find(d => d.id === parseInt(p.directorId))?.nombre || 'EliteStream Studio'}</span>
                                                </div>

                                                <div className="d-flex flex-wrap gap-1 mb-3">
                                                    {(p.actoresIds || []).slice(0, 3).map(id => (
                                                        <span key={id} className="text-dim" style={{ fontSize: '0.55rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px' }}>
                                                            {actores.find(a => a.id === parseInt(id))?.nombre.split(' ')[0] || 'Actor'}
                                                        </span>
                                                    ))}
                                                    {p.actoresIds?.length > 3 && <span className="text-dim" style={{ fontSize: '0.55rem' }}>+{p.actoresIds.length - 3}</span>}
                                                </div>
                                                
                                                <div className="d-flex gap-2 mt-4">
                                                    <button className="btn-link-premium flex-fill justify-content-center" onClick={() => { setPeliculaSeleccionada(p); setFormData(p); setShowModal(true); setTmdbSuggestions([]); }}>
                                                        <Edit3 size={14} /> Editar
                                                    </button>
                                                    <button className="btn-link-premium flex-fill justify-content-center text-primary" onClick={() => window.open(`https://www.youtube.com/watch?v=${p.trailer}`, '_blank')}>
                                                        <Eye size={14} /> Tráiler
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Tilt>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>
                )}
            </Container>

            <AnimatePresence>
                {showModal && (
                    <Modal show={true} onHide={() => setShowModal(false)} size="xl" centered contentClassName="premium-modal">
                        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
                            <Modal.Title className="page-title h3 mb-0" style={{ fontSize: '2.5rem' }}>
                                {peliculaSeleccionada ? 'Modificar Película' : 'Nueva Adquisición'}
                            </Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body className="premium-body pt-0">
                                <div className="tmdb-search-box text-center bg-transparent border-0 mb-4" style={{ background: 'rgba(245, 197, 24, 0.02)', padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '-20px', position: 'relative' }}>
                                    <div className="d-flex flex-column gap-2 w-100 mx-auto" style={{ maxWidth: '600px' }}>
                                        <div className="d-flex gap-3">
                                            <Form.Control type="text" placeholder="ESCRIBE EL NOMBRE DE LA PELÍCULA PARÁ SUGERENCIAS..." className="premium-input py-2 text-center" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ letterSpacing: '2px', fontSize: '0.7rem' }} />
                                            <Button className="btn-premium px-4" onClick={searchTMDB} disabled={isSearching}>
                                                BUSCAR
                                            </Button>
                                        </div>

                                        {/* SUGGESTIONS DROPDOWN */}
                                        <AnimatePresence>
                                            {tmdbSuggestions.length > 0 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="suggestions-dropdown shadow-lg position-absolute w-100" 
                                                    style={{ 
                                                        top: '100%', left: '0', zIndex: 1000, 
                                                        background: 'rgba(5, 5, 5, 0.95)', 
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(245, 197, 24, 0.3)',
                                                        marginTop: '5px', borderRadius: '8px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {tmdbSuggestions.map(suggestion => (
                                                        <div 
                                                            key={suggestion.id}
                                                            className="p-3 border-bottom border-secondary border-opacity-10 d-flex gap-3 align-items-center suggestion-item"
                                                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                                            onClick={() => selectFilmFromTmdb(suggestion)}
                                                        >
                                                            <img src={suggestion.poster_path ? `https://image.tmdb.org/t/p/w92${suggestion.poster_path}` : 'https://via.placeholder.com/92x138'} style={{ width: '40px', borderRadius: '4px' }} alt="" />
                                                            <div className="text-start">
                                                                <h5 className="text-white small mb-0">{suggestion.title}</h5>
                                                                <p className="text-dim extra-small mb-0">{suggestion.release_date ? suggestion.release_date.split('-')[0] : 'TBD'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <Row className="g-5 align-items-stretch">
                                    <Col lg={4} className="border-end border-secondary border-opacity-25 pr-4">
                                        <div className="mb-4">
                                            <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold" style={{ letterSpacing: '4px' }}>Identificador Visual</Form.Label>
                                            <div style={{ aspectRatio: '2/3', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                                                <img 
                                                    src={formData.portada || 'https://via.placeholder.com/500x750?text=Digital+Asset'} 
                                                    alt="Preview" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            </div>
                                        </div>
                                        <Form.Group className="mb-0">
                                            <Form.Label className="text-dim extra-small text-uppercase">URL Recurso Externo</Form.Label>
                                            <Form.Control name="portada" value={formData.portada} onChange={handleInputChange} className="premium-input py-2" placeholder="https://..." style={{ fontSize: '0.65rem', opacity: 0.6 }} />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={8}>
                                        <Row className="g-4 mb-4">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="text-dim extra-small text-uppercase mb-2">Denominación Oficial</Form.Label>
                                                    <Form.Control name="titulo" value={formData.titulo} onChange={handleInputChange} required className="premium-input py-3" style={{ fontSize: '1.2rem', fontWeight: '700' }} />
                                                </Form.Group>
                                            </Col>
                                            
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="text-dim extra-small text-uppercase mb-2">Director Visionario</Form.Label>
                                                    <Form.Select name="directorId" value={formData.directorId} onChange={handleInputChange} required className="premium-input py-2">
                                                        <option value="">Seleccionar...</option>
                                                        {directores.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="text-dim extra-small text-uppercase mb-2">Categoría / Género</Form.Label>
                                                    <Form.Select name="generoId" value={formData.generoId} onChange={handleInputChange} required className="premium-input py-2">
                                                        <option value="">Seleccionar...</option>
                                                        {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="text-dim extra-small text-uppercase mb-2">Tráiler (ID YouTube)</Form.Label>
                                                    <Form.Control name="trailer" value={formData.trailer} onChange={handleInputChange} className="premium-input py-2" placeholder="TMDb Link" />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="text-primary extra-small text-uppercase mb-3 fw-bold d-block" style={{ letterSpacing: '4px' }}>Elenco Vinculado</Form.Label>
                                                    <div className="d-flex flex-wrap gap-2 p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '150px', overflowY: 'auto', borderRadius: '4px' }}>
                                                        {actores.map(actor => (
                                                            <div key={actor.id} className="d-flex align-items-center gap-2 mb-2 me-3">
                                                                <Form.Check 
                                                                    type="checkbox"
                                                                    id={`actor-${actor.id}`}
                                                                    checked={(formData.actoresIds || []).includes(actor.id) || (formData.actoresIds || []).includes(actor.id.toString())}
                                                                    onChange={(e) => {
                                                                        const ids = formData.actoresIds || [];
                                                                        if (e.target.checked) {
                                                                            setFormData({ ...formData, actoresIds: [...ids, actor.id] });
                                                                        } else {
                                                                            setFormData({ ...formData, actoresIds: ids.filter(id => id != actor.id) });
                                                                        }
                                                                    }}
                                                                />
                                                                <label htmlFor={`actor-${actor.id}`} className="text-dim extra-small cursor-pointer mb-0" style={{ fontSize: '0.7rem' }}>{actor.nombre} {actor.apellido || ''}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-0">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Form.Label className="text-dim extra-small text-uppercase">Crítica Cinematográfica / Reseña Profesional</Form.Label>
                                                <button type="button" className="btn-link-premium text-info border-0 py-1" onClick={generarReseñaIA} disabled={isGenerating}>
                                                    {isGenerating ? <Spinner size="sm" animation="border" className="me-2" /> : <Sparkles size={12} />}
                                                    {isGenerating ? 'RESUMIENDO...' : 'RESUMIR CON IA'}
                                                </button>
                                            </div>
                                            <Form.Control as="textarea" rows={9} name="resena" value={formData.resena} onChange={handleInputChange} required className="premium-input" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer className="premium-footer border-0 p-4">
                                <Button className="btn-premium px-5" type="submit">
                                    Finalizar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Peliculas;