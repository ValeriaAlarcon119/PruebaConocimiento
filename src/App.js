import React from 'react';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirigir al login y guardar la URL intentada para redirigir después del login
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
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
                        <PrivateRoute>
                            <Welcome />
                        </PrivateRoute>
                    } />
                    <Route path="/peliculas" element={
                        <PrivateRoute>
                            <Peliculas />
                        </PrivateRoute>
                    } />
                    <Route path="/directores" element={
                        <PrivateRoute>
                            <Directores />
                        </PrivateRoute>
                    } />
                    <Route path="/generos" element={
                        <PrivateRoute>
                            <Generos />
                        </PrivateRoute>
                    } />
                    <Route path="/paises" element={
                        <PrivateRoute>
                            <Paises />
                        </PrivateRoute>
                    } />
                    <Route path="/actores" element={
                        <PrivateRoute>
                            <Actores />
                        </PrivateRoute>
                    } />
                    <Route path="/contacto" element={
                        <PrivateRoute>
                            <Contacto />
                        </PrivateRoute>
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
