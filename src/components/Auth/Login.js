import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ShieldCheck, Sparkles, Fingerprint } from 'lucide-react';
import '../../App.css';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (credentials.username === 'adminsql' && credentials.password === 'MiC0ntraseñ@Segura!') {
                localStorage.setItem('token', 'fake-jwt-token-for-local-dev');
                toast.success('Acceso concedido. Bienvenido al panel de control.');
                navigate('/welcome');
            } else {
                toast.error('Identidad no verificada. Acceso denegado.');
            }
            setLoading(false);
        }, 1500);
    };

    const handleAutoFill = () => {
        setCredentials({ username: 'adminsql', password: 'MiC0ntraseñ@Segura!' });
        toast.info('Credenciales de demostración autocompletadas.');
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(245, 197, 24, 0.05) 0%, transparent 100%), 
                             url(${process.env.PUBLIC_URL}/cinema_hero_background_1775368570710.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Light Orbs for that 2026 feel */}
            <motion.div 
                animate={{ 
                    x: [0, 50, 0], 
                    y: [0, -30, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '20%', 
                    width: '300px', 
                    height: '300px', 
                    borderRadius: '50%', 
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }}
            />

            <Container style={{ position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="d-flex justify-content-center"
                >
                    <Card className="premium-modal" style={{ 
                        width: '480px', 
                        padding: '40px', 
                        border: '1px solid rgba(255, 255, 255, 10%)',
                        background: 'rgba(15, 15, 15, 0.7)',
                        backdropFilter: 'blur(30px)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
                    }}>
                        <Card.Body>
                            <div className="text-center mb-5">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h1 className="brand-title" style={{ fontSize: '3.5rem', letterSpacing: '4px', marginBottom: '0' }}>
                                        ELITESTREAM
                                    </h1>
                                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                                        <div style={{ height: '1px', width: '20px', background: 'var(--primary)' }} />
                                        <p className="text-dim extra-small text-uppercase mb-0" style={{ letterSpacing: '6px', fontSize: '0.6rem' }}>
                                            SUITE PROFESIONAL 2026
                                        </p>
                                        <div style={{ height: '1px', width: '20px', background: 'var(--primary)' }} />
                                    </div>
                                </motion.div>
                            </div>

                            <Form onSubmit={handleSubmit} className="mt-4">
                                <Form.Group className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="text-dim extra-small fw-bold text-uppercase d-flex align-items-center gap-2 mb-0">
                                            <User size={12} className="text-primary" /> IDENTIFICADOR
                                        </Form.Label>
                                        <span 
                                            onClick={handleAutoFill}
                                            style={{ 
                                                cursor: 'pointer', 
                                                fontSize: '0.6rem', 
                                                color: 'var(--primary)', 
                                                opacity: 0.7,
                                                letterSpacing: '1px'
                                            }}
                                            className="text-uppercase fw-bold"
                                        >
                                            [ Autocompletar ]
                                        </span>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        required
                                        className="premium-input py-3"
                                        placeholder="Ingrese Id de Operador"
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="text-dim extra-small fw-bold text-uppercase d-flex align-items-center gap-2 mb-2">
                                        <Lock size={12} className="text-primary" /> LLAVE PRIVADA
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        className="premium-input py-3"
                                        placeholder="••••••••••••"
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                </Form.Group>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-3"
                                        type="submit"
                                        disabled={loading}
                                        style={{ height: '55px', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {loading ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <Spinner size="sm" animation="border" />
                                                    <span>VERIFICANDO...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="submit"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <Fingerprint size={20} />
                                                    <span>SINCRONIZAR ACCESO</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </motion.div>
                            </Form>

                            <div className="mt-5 text-center">
                                <div className="d-flex align-items-center justify-content-center gap-2 text-dim extra-small mb-2" style={{ opacity: 0.5 }}>
                                    <ShieldCheck size={10} />
                                    <span>CONEXIÓN SEGURA TLS 1.4</span>
                                </div>
                                <p className="text-dim extra-small m-0" style={{ fontSize: '0.6rem', opacity: 0.3 }}>
                                    AUTORIZADO PARA USO ADMINISTRATIVO ÚNICAMENTE
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default Login;