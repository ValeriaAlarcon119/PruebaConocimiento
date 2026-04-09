import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Welcome from './pages/Welcome';
import Peliculas from './pages/Peliculas';
import Directores from './pages/Directores';
import Generos from './pages/Generos';
import Paises from './pages/Paises';
import Actores from './pages/Actores';
import Login from './components/Auth/Login';
import Contacto from './pages/Contacto';
import { Toaster } from 'sonner';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

// --- RELAXING BOKEH SYSTEM FOR CINEMATIC FRESHNESS ---
const CinematicAmbience = () => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* LARGE RELAXING ORBS */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.25, 0.1]
                    }}
                    transition={{
                        duration: 30 + Math.random() * 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        width: '40vw',
                        height: '40vw',
                        borderRadius: '50%',
                        background: i % 2 === 0 ? 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245, 197, 24, 0.08) 0%, transparent 70%)',
                        filter: 'blur(100px)'
                    }}
                />
            ))}
            
            {/* FLOATING CINEMATIC DUST PARTICLES */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={`dust-${i}`}
                    animate={{
                        y: ["110vh", "-10vh"],
                        x: [Math.random() * 100 + "vw", (Math.random() * 100 - 10) + "vw"],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: 25 + Math.random() * 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 20
                    }}
                    style={{
                        position: 'absolute',
                        width: '2px',
                        height: '2px',
                        background: '#ffffff',
                        borderRadius: '50%',
                        filter: 'blur(1px)'
                    }}
                />
            ))}
        </div>
    );
};

function App() {
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timeout;
        const resetTimeout = () => {
            setIsIdle(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsIdle(true), 8000); // 8 seconds of idle
        };
        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('scroll', resetTimeout);
        window.addEventListener('keydown', resetTimeout);
        resetTimeout();
        return () => {
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('scroll', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
        };
    }, []);

    // 2026 INERTIAL SMOOTH SCROLL INTEGRATION
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smoothWheel: true,
            infinite: false,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <Router>
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', backgroundColor: '#0f0c1d' }}>
                <CinematicAmbience />

                {/* --- CINEMATIC IDLE EFFECT: SCANLINE OVERLAY --- */}
                <AnimatePresence>
                    {isIdle && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="idle-scanline"
                        />
                    )}
                </AnimatePresence>
                
                <Toaster 
                    position="top-right" richColors closeButton theme="dark"
                    toastOptions={{
                        style: {
                            background: 'rgba(10, 10, 10, 0.85)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            borderRadius: '0px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    }}
                />
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
                        <Route path="/peliculas" element={<ProtectedRoute><Peliculas /></ProtectedRoute>} />
                        <Route path="/directores" element={<ProtectedRoute><Directores /></ProtectedRoute>} />
                        <Route path="/generos" element={<ProtectedRoute><Generos /></ProtectedRoute>} />
                        <Route path="/paises" element={<ProtectedRoute><Paises /></ProtectedRoute>} />
                        <Route path="/actores" element={<ProtectedRoute><Actores /></ProtectedRoute>} />
                        <Route path="/contacto" element={<ProtectedRoute><Contacto /></ProtectedRoute>} />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
