import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Generos = () => {
    const navigate = useNavigate();
    const [generos, setGeneros] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: ''
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [peliculas, setPeliculas] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Por favor, inicie sesión para continuar.');
                navigate('/login'); // Redirige al login si no está autenticado
            } else {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return; // No continuar si no está autenticado
            setLoading(true);
            await cargarGeneros();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await api.get('/peliculas');
                setPeliculas(response.data.$values || []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                    navigate('/login'); // Redirige al login si la sesión ha expirado
                } else {
                    toast.error('Error al cargar las películas');
                }
            }
        };
        fetchPeliculas();
    }, [navigate]);

    const cargarGeneros = async () => {
        try {
            const response = await api.get('/generos');
            setGeneros(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login'); // Redirige al login si la sesión ha expirado
            } else {
                toast.error('Error al cargar los géneros');
            }
        }
    };

    const handleShowModal = (genero = null) => {
        if (genero) {
            setGeneroSeleccionado(genero);
            setFormData({
                nombre: genero.nombre
            });
        } else {
            setGeneroSeleccionado(null);
            setFormData({
                nombre: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setGeneroSeleccionado(null);
        setFormData({
            nombre: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleShowDetails = (genero) => {
        setGeneroSeleccionado(genero);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setGeneroSeleccionado(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar si ya existe un género con el mismo nombre
            const generoExistente = generos.find(
                g => g.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    g.id !== generoSeleccionado?.id
            );

            if (generoExistente) {
                toast.error('Ya existe un género con este nombre');
                return;
            }

            if (generoSeleccionado) {
                await api.put(`/generos/${generoSeleccionado.id}`, formData);
                toast.success('Género actualizado exitosamente');
            } else {
                await api.post('/generos', formData);
                toast.success('Género creado exitosamente');
            }
            handleCloseModal();
            cargarGeneros();
        } catch (error) {
            toast.error('Error al guardar el género');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Verificar si el género está en uso
            const response = await api.get(`/peliculas`);
            const peliculas = response.data.$values || [];
            const generoEnUso = peliculas.some(pelicula => pelicula.generoId === id);

            if (generoEnUso) {
                toast.error('No es permitido borrar este género porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este género?')) {
                await api.delete(`/generos/${id}`);
                toast.success('Género eliminado exitosamente');
                cargarGeneros();
            }
        } catch (error) {
            toast.error('Error al eliminar el género');
        }
    };

    return (
        <div className="custom-container">
            <h2 className="text-center mb-4" style={{ color: '#6c757d' }}>Gestión de Géneros</h2>
            
            <div className="table-wrapper">
                <div className="button-container">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()}
                        className="d-flex align-items-center gap-2 new-director-button"
                    >
                        <FaPlus /> Nuevo Género
                    </Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '30px' }}>
                    <table className="table table-striped table-bordered shadow-sm">
                        <thead className="bg-light text-dark">
                            <tr>
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generos.length > 0 ? (
                                generos.map((genero) => (
                                    <tr key={genero.id} className="text-center">
                                        <td>{genero.nombre}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(genero)}
                                                    className="p-2"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(genero.id)}
                                                    className="p-2"
                                                >
                                                    <FaTrash />
                                                </Button>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm"
                                                    onClick={() => handleShowDetails(genero)}
                                                    className="p-2"
                                                >
                                                    <FaEye />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">No hay géneros disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {generoSeleccionado ? 'Detalles del Género' : 'Nuevo Género'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                                style={{ borderRadius: '20px' }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Género</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={generoSeleccionado?.nombre || ''}
                                disabled={true}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Generos; 