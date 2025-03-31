import React, { useState, useEffect, useCallback } from 'react';
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

    const cargarDirectores = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/directores', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDirectores(data);
            }
        } catch (error) {
            console.error('Error al cargar directores:', error);
            toast.error('Error al cargar los directores');
        } finally {
            setLoading(false);
        }
    }, []);

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
            setFormData({
                nombre: director.nombre,
                apellido: director.apellido,
                paisId: director.pais.id
            });
            setDirectorSeleccionado(director);
        } else {
            setFormData({
                nombre: '',
                apellido: '',
                paisId: ''
            });
            setDirectorSeleccionado(null);
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
            const url = directorSeleccionado
                ? `http://localhost:8080/api/directores/${directorSeleccionado.id}`
                : 'http://localhost:8080/api/directores';
            
            const method = directorSeleccionado ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                handleCloseModal();
                cargarDirectores();
                toast.success(directorSeleccionado ? 'Director actualizado exitosamente' : 'Director creado exitosamente');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Error al guardar el director');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el director');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este director?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/directores/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    cargarDirectores();
                    toast.success('Director eliminado exitosamente');
                } else {
                    const error = await response.json();
                    toast.error(error.message || 'Error al eliminar el director');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error al eliminar el director');
            }
        }
    };

    return (
        <div className="page-background">
            <div className="custom-container">
                <h2 className="page-title">Gestión de Directores</h2>
                <p className="text-center text-white mb-4">
                    Aquí encuentras información sobre los directores y puedes gestionar esta información
                </p>
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
                                        <th>País</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {directores.map((director) => (
                                        <tr key={director.id}>
                                            <td>{director.nombre}</td>
                                            <td>{director.apellido}</td>
                                            <td>{director.pais.nombre}</td>
                                            <td>
                                                <FaEye 
                                                    className="icon" 
                                                    onClick={() => handleShowDetails(director)}
                                                />
                                                <FaEdit 
                                                    className="icon" 
                                                    onClick={() => handleShowModal(director)}
                                                />
                                                <FaTrash 
                                                    className="icon" 
                                                    onClick={() => handleDelete(director.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>
                            {directorSeleccionado ? 'Editar Director' : 'Nuevo Director'}
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
                            <Button variant="danger" onClick={handleCloseModal}>
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
                            <Form.Group className="mb-3">
                                <Form.Label>País</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={directorSeleccionado?.pais?.nombre || ''}
                                    disabled={true}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseDetailsModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Directores; 