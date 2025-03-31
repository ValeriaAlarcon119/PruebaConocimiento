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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
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
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
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
                </Routes>

            </Layout>
        </Router>
    );
}

export default App;
