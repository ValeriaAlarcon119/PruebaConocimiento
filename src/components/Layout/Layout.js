import React from 'react';
import NavigationBar from './Navbar'; // Asegúrate de que esta ruta sea correcta
import Footer from './Footer'; // Importa el nuevo componente Footer

const Layout = ({ children }) => {
    return (
        <div>
            <NavigationBar />
            <main style={{ paddingBottom: '60px' }}>{children}</main>
            <Footer /> {/* Incluye el Footer aquí */}
        </div>
    );
};

export default Layout;
