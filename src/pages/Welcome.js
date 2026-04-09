import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Film, 
    Users, 
    Globe, 
    PhoneCall, 
    Sparkles, 
    Play, 
    ShieldCheck, 
    Zap, 
    Layers,
    UserCircle,
    ArrowRight
} from 'lucide-react';
import '../App.css';

const Welcome = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const categories = [
        { path: '/generos', icon: <Layers />, title: 'Géneros', desc: 'Curaduría editorial por categorías, drama, acción y más.' },
        { path: '/directores', icon: <Users />, title: 'Directores', desc: 'Gestión exhaustiva de la visión cinematográfica global.' },
        { path: '/actores', icon: <UserCircle />, title: 'Elenco', desc: 'Administra el talento estrella de tus producciones de elite.' },
        { path: '/paises', icon: <Globe />, title: 'Origen', desc: 'Explora la diversidad geográfica del cine internacional.' },
    ];

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', paddingBottom: '120px' }}>
            {/* New Ultra-Modern Hero */}
            <div className="position-relative overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    style={{ 
                        position: 'absolute', 
                        width: '100%', 
                        height: '100%', 
                        backgroundImage: `url(${process.env.PUBLIC_URL}/cinema_hero_background_1775368570710.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    }}
                />
                
                {/* Gradient Overlays */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, #050505)', zIndex: 1 }} />
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(245,197,24,0.1), transparent 50%)', zIndex: 1 }} />

                <Container className="text-center" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                            <motion.div 
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{ color: 'var(--primary)' }}
                            >
                                <Zap size={20} />
                            </motion.div>
                            <span className="text-primary extra-small fw-bold" style={{ letterSpacing: '8px' }}>PLATAORMA DE ALTO RENDIMIENTO</span>
                        </div>
                        
                        <h1 className="page-title mb-3" style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', color: '#fff', letterSpacing: '-2px' }}>
                            DOMINA EL <br/>
                            <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(245,197,24,0.3)' }}>CINE DIGITAL</span>
                        </h1>
                        
                        <p className="lead text-dim mx-auto mb-5" style={{ maxWidth: '800px', fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.6 }}>
                            Bienvenido a <span className="text-white fw-bold">EliteStream Pro</span>. La suite definitiva de 2026 diseñada para gestionar, 
                            analizar y potenciar catálogos cinematográficos de gran escala con precisión quirúrgica.
                        </p>
                        
                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button as={Link} to="/peliculas" className="btn-premium d-flex align-items-center gap-3 px-5 py-3 rounded-0" style={{ fontSize: '0.9rem' }}>
                                    <Play size={18} fill="currentColor" /> EXPLORAR CATÁLOGO
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button as={Link} to="/directores" className="btn-premium-outline d-flex align-items-center gap-3 px-5 py-3 rounded-0" style={{ fontSize: '0.9rem' }}>
                                    <Users size={18} /> VISIONARIOS
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </Container>
            </div>

            <Container className="custom-container" style={{ marginTop: '-80px' }}>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="row g-4"
                >
                    {categories.map((cat, idx) => (
                        <Col key={idx} lg={3} md={6}>
                            <motion.div variants={itemVariants}>
                                <Link to={cat.path} className="text-decoration-none h-100 d-block">
                                    <div className="movie-card-premium h-100 p-5 d-flex flex-column align-items-start text-start" 
                                         style={{ 
                                             border: '1px solid rgba(255,255,255,0.05)',
                                             background: 'rgba(255,255,255,0.02)',
                                             backdropFilter: 'blur(10px)',
                                             transition: 'var(--transition)'
                                         }}
                                    >
                                        <div className="mb-4 text-primary" style={{ opacity: 0.8 }}>
                                            {React.cloneElement(cat.icon, { size: 32 })}
                                        </div>
                                        <h3 className="movie-title mb-3" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>{cat.title}</h3>
                                        <p className="text-dim extra-small mb-4" style={{ lineHeight: 1.5, opacity: 0.6 }}>{cat.desc}</p>
                                        <div className="mt-auto d-flex align-items-center gap-2 text-primary extra-small fw-bold" style={{ letterSpacing: '2px' }}>
                                            GESTIONAR <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </Col>
                    ))}

                    <Col lg={12}>
                        <motion.div variants={itemVariants}>
                            <Link to="/contacto" className="text-decoration-none">
                                <div className="movie-card-premium p-5 d-flex align-items-center gap-5" 
                                     style={{ background: 'linear-gradient(90deg, rgba(245,197,24,0.05), transparent)' }}>
                                    <div className="p-4 rounded-circle" style={{ background: 'rgba(245,197,24,0.1)', color: 'var(--primary)' }}>
                                        <PhoneCall size={32} />
                                    </div>
                                    <div>
                                        <h3 className="movie-title mb-2" style={{ fontSize: '1.8rem' }}>¿Necesitas asistencia de élite?</h3>
                                        <p className="text-dim extra-small mb-0" style={{ fontSize: '0.8rem', maxWidth: '600px' }}>
                                            Nuestra línea directa de soporte 2026 está activa. Sincroniza con un especialista para resolver 
                                            consultas arquitectónicas o dudas operativas de inmediato.
                                        </p>
                                    </div>
                                    <div className="ms-auto d-none d-md-flex align-items-center gap-3">
                                        <span className="extra-small text-primary fw-bold" style={{ letterSpacing: '4px' }}>CONECTAR AHORA</span>
                                        <ArrowRight className="text-primary" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </Col>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.4 }}
                    transition={{ duration: 1.5 }}
                    className="text-center mt-5"
                >
                    <div className="d-flex align-items-center justify-content-center gap-3 text-dim extra-small" style={{ opacity: 0.3 }}>
                        <ShieldCheck size={12} />
                        <span style={{ letterSpacing: '6px' }}>CORE ENGINE V4.8.0 CERTIFIED BY ELITESTREAM OS</span>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Welcome;