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
                navigate('/login'); 
            } else {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;
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
                    navigate('/login');
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
            const generoExistente = generos.find(
                g => g.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    g.id !== generoSeleccionado?.id
            );

            if (generoExistente) {
                toast.error('Ya existe un género con este nombre');
                return;
            }

            const generoData = {
                id: generoSeleccionado ? generoSeleccionado.id : 0,
                nombre: formData.nombre
            };

            if (generoSeleccionado) {
                await api.put(`/generos/${generoSeleccionado.id}`, generoData);
                toast.success('Género actualizado exitosamente');
            } else {
                await api.post('/generos', generoData);
                toast.success('Género creado exitosamente');
            }
            handleCloseModal();
            cargarGeneros();
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al guardar el género');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const generoEnUso = peliculas.some(pelicula => pelicula.generoId === id);

            if (generoEnUso) {
                toast.error('No es permitido borrar este género porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este género?')) {
                await api.delete(`/generos/${id}`);
                cargarGeneros();
                toast.success('Género eliminado exitosamente');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar el género');
        }
    };

    return (
        <div className="page-background">
            <div className="custom-container">
                <h2 className="page-title">Gestión de Géneros</h2>
                <p className="text-center text-white mb-4">
                    Aquí encuentras información sobre los géneros cinematográficos y puedes gestionar esta información
                </p>
                
                <div className="table-wrapper">
                <div className="d-flex justify-content-end mb-4" style={{ marginTop: '-20px' }}>
                    <Button variant="primary" onClick={() => handleShowModal()} className="d-flex align-items-center gap-2 new-genero-button">
                        <FaPlus /> Agregar
                    </Button>
                </div>
                    {loading ? (
                        
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                            <p className="loading-message">Cargando...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover style={{ width: '70%', margin: '0 auto' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50%' }}>Nombre</th>
                                        <th style={{ width: '50%' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generos.map((genero) => (
                                        <tr key={genero.id}>
                                            <td>{genero.nombre}</td>
                                            <td>
                                                <FaEye className="icon fa-eye" onClick={() => handleShowDetails(genero)} title="Ver detalles" />
                                                <FaEdit className="icon fa-edit" onClick={() => handleShowModal(genero)} title="Editar" />
                                                <FaTrash className="icon fa-trash" onClick={() => handleDelete(genero.id)} title="Eliminar" />
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
                        <Modal.Title className="text-center w-100">
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
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-center">
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
                        <Modal.Title className="text-center w-100">Detalles del Género</Modal.Title>
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
                    <Modal.Footer className="d-flex justify-content-center">
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