import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
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
        nombre: '',
        descripcion: ''
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

    const cargarGeneros = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/generos');
            setGeneros(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login');
            } else {
                toast.error('Error al cargar los géneros');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        cargarGeneros();
    }, [cargarGeneros]);

    const handleShowModal = (genero = null) => {
        if (genero) {
            setGeneroSeleccionado(genero);
            setFormData({
                nombre: genero.nombre,
                descripcion: genero.descripcion
            });
        } else {
            setGeneroSeleccionado(null);
            setFormData({
                nombre: '',
                descripcion: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setGeneroSeleccionado(null);
        setFormData({
            nombre: '',
            descripcion: ''
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
            console.error('Error:', error);
            toast.error('Error al guardar el género');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este género?')) {
            try {
                await api.delete(`/generos/${id}`);
                cargarGeneros();
                toast.success('Género eliminado exitosamente');
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error al eliminar el género');
            }
        }
    };

    return (
        <div className="page-background">
            <div className="custom-container">
                <h2 className="page-title">Gestión de Géneros</h2>
                <p className="text-center text-white mb-4">
                    Aquí encuentras información sobre los géneros cinematográficos y puedes gestionar esta información
                </p>
                <div className="d-flex justify-content-end mb-4">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()}
                        className="d-flex align-items-center gap-2 new-director-button"
                    >
                        <FaPlus /> Nuevo Género
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
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generos.map((genero) => (
                                        <tr key={genero.id}>
                                            <td>{genero.nombre}</td>
                                            <td>{genero.descripcion}</td>
                                            <td>
                                                <FaEye 
                                                    className="icon" 
                                                    onClick={() => handleShowDetails(genero)}
                                                />
                                                <FaEdit 
                                                    className="icon" 
                                                    onClick={() => handleShowModal(genero)}
                                                />
                                                <FaTrash 
                                                    className="icon" 
                                                    onClick={() => handleDelete(genero.id)}
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
                            {generoSeleccionado ? 'Editar Género' : 'Nuevo Género'}
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
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    required
                                    style={{ borderRadius: '20px' }}
                                />
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
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={generoSeleccionado?.descripcion || ''}
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

export default Generos; 