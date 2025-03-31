import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Directores = () => {
    const navigate = useNavigate();
    const [directores, setDirectores] = useState([]);
    const [paises, setPaises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [directorSeleccionado, setDirectorSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        paisId: ''
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
            await cargarDirectores();
            await cargarPaises();
            await cargarPeliculas();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    const cargarDirectores = async () => {
        try {
            const response = await api.get('/directores');
            setDirectores(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login'); // Redirige al login si la sesión ha expirado
            } else {
                toast.error('Error al cargar los directores');
            }
        }
    };

    const cargarPaises = async () => {
        try {
            const response = await api.get('/paises');
            setPaises(response.data.$values || []);
        } catch (error) {
            toast.error('Error al cargar los países');
        }
    };

    const cargarPeliculas = async () => {
        try {
            const response = await api.get('/peliculas');
            setPeliculas(response.data.$values || []);
        } catch (error) {
            toast.error('Error al cargar las películas');
        }
    };

    const handleShowModal = (director = null) => {
        if (director) {
            setDirectorSeleccionado(director);
            setFormData({
                nombre: director.nombre,
                apellido: director.apellido,
                paisId: director.paisId.toString()
            });
        } else {
            setDirectorSeleccionado(null);
            setFormData({
                nombre: '',
                apellido: '',
                paisId: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDirectorSeleccionado(null);
        setFormData({
            nombre: '',
            apellido: '',
            paisId: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleShowDetails = (director) => {
        setDirectorSeleccionado(director);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setDirectorSeleccionado(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar si ya existe un director con el mismo nombre y apellido
            const directorExistente = directores.find(
                d => d.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    d.apellido.toLowerCase() === formData.apellido.toLowerCase() &&
                    d.id !== directorSeleccionado?.id
            );

            if (directorExistente) {
                toast.error('Ya existe un director con este nombre y apellido');
                return;
            }

            if (directorSeleccionado) {
                await api.put(`/directores/${directorSeleccionado.id}`, formData);
                toast.success('Director actualizado exitosamente');
            } else {
                await api.post('/directores', formData);
                toast.success('Director creado exitosamente');
            }
            handleCloseModal();
            cargarDirectores();
        } catch (error) {
            toast.error('Error al guardar el director');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Verificar si el director está en uso
            const response = await api.get(`/peliculas`);
            const peliculas = response.data.$values || [];
            const directorEnUso = peliculas.some(pelicula => pelicula.directorId === id);

            if (directorEnUso) {
                toast.error('No es permitido borrar este director porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este director?')) {
                await api.delete(`/directores/${id}`);
                toast.success('Director eliminado exitosamente');
                cargarDirectores();
            }
        } catch (error) {
            toast.error('Error al eliminar el director');
        }
    };

    return (
        <div className="page-background">
            <div className="custom-container">
                <h2 className="page-title">Gestión de Directores</h2>
                <div className="d-flex justify-content-end mb-4">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()}
                        className="d-flex align-items-center gap-2 new-director-button"
                    >
                        <FaPlus /> Nuevo Director
                    </Button>
                </div>
                
                <div className="table-wrapper">
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                            <p className="loading-message">Cargando...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {directores.map((director) => (
                                        <tr key={director.id}>
                                            <td>{director.nombre}</td>
                                            <td>{director.apellido}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(director)}
                                                    className="me-2"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(director.id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {directorSeleccionado ? 'Detalles del Director' : 'Nuevo Director'}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                required
                                style={{ borderRadius: '20px' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>País</Form.Label>
                            <Form.Select
                                name="paisId"
                                value={formData.paisId}
                                onChange={handleInputChange}
                                required
                                style={{ borderRadius: '20px' }}
                            >
                                <option value="">Seleccione un país</option>
                                {paises.map((pais) => (
                                    <option key={pais.id} value={pais.id}>
                                        {pais.nombre}
                                    </option>
                                ))}
                            </Form.Select>
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
                    <Modal.Title>Detalles del Director</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={directorSeleccionado?.nombre || ''}
                                disabled={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                value={directorSeleccionado?.apellido || ''}
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

export default Directores; 