import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Welcome from './pages/Welcome';
import Peliculas from './pages/Peliculas';
import Directores from './pages/Directores';
import Generos from './pages/Generos';
import Paises from './pages/Paises';
import Actores from './pages/Actores';
import Contacto from './pages/Contacto';
import ProtectedRoute from './components/ProtectedRoute';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirigir al login y guardar la URL intentada para redirigir después del login
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('token') !== null;

    return (
        <Router>
            <Layout>
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <Routes>
                    {/* Ruta pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Rutas protegidas */}
                    <Route path="/welcome" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Welcome />
                        </ProtectedRoute>
                    } />
                    <Route path="/peliculas" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Peliculas />
                        </ProtectedRoute>
                    } />
                    <Route path="/directores" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Directores />
                        </ProtectedRoute>
                    } />
                    <Route path="/generos" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Generos />
                        </ProtectedRoute>
                    } />
                    <Route path="/paises" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Paises />
                        </ProtectedRoute>
                    } />
                    <Route path="/actores" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Actores />
                        </ProtectedRoute>
                    } />
                    <Route path="/contacto" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Contacto />
                        </ProtectedRoute>
                    } />

                    {/* Ruta por defecto y catch-all */}
                    <Route path="/" element={<Navigate to="/welcome" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
