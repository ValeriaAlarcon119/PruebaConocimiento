import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Welcome from './pages/Welcome';
import Peliculas from './pages/Peliculas';
import Directores from './pages/Directores';
import Generos from './pages/Generos';
import Paises from './pages/Paises';
import Actores from './pages/Actores';
import Login from './components/Auth/Login';
import Contacto from './pages/Contacto';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/peliculas" element={<Peliculas />} />
                    <Route path="/directores" element={<Directores />} />
                    <Route path="/generos" element={<Generos />} />
                    <Route path="/paises" element={<Paises />} />
                    <Route path="/actores" element={<Actores />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/" element={<Navigate to="/welcome" />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
