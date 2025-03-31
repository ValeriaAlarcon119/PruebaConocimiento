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
            const response = await api.get('/directores');
            const directoresConPaises = await Promise.all(response.data.$values.map(async (director) => {
                const paisResponse = await api.get(`/paises/${director.paisId}`);
                return {
                    ...director,
                    pais: paisResponse.data 
                };
            }));
            setDirectores(directoresConPaises);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login');
            } else {
                toast.error('Error al cargar los directores');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const cargarPaises = async () => {
        try {
            const response = await api.get('/paises');
            setPaises(response.data.$values || []);
        } catch (error) {
            console.error('Error al cargar países:', error);
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
                paisId: director.pais?.id || ''
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
            const directorExistente = directores.find(
                d => d.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    d.apellido.toLowerCase() === formData.apellido.toLowerCase() &&
                    d.id !== directorSeleccionado?.id
            );

            if (directorExistente) {
                toast.error('Ya existe un director con este nombre y apellido');
                return;
            }

            const directorData = {
                id: directorSeleccionado ? directorSeleccionado.id : 0,
                nombre: formData.nombre,
                apellido: formData.apellido,
                paisId: parseInt(formData.paisId)
            };

            if (directorSeleccionado) {
                await api.put(`/directores/${directorSeleccionado.id}`, directorData);
                toast.success('Director actualizado exitosamente');
            } else {
                await api.post('/directores', directorData);
                toast.success('Director creado exitosamente');
            }
            handleCloseModal();
            cargarDirectores();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el director');
        }
    };

    const handleDelete = async (id) => {
        try {
            const directorEnUso = peliculas.some(pelicula => pelicula.directorId === id);

            if (directorEnUso) {
                toast.error('No es permitido borrar este director porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este director?')) {
                await api.delete(`/directores/${id}`);
                cargarDirectores();
                toast.success('Director eliminado exitosamente');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar el director');
        }
    };

    return (
        <div className="page-background">
            <div className="custom-container">
                <h2 className="page-title">Gestión de Directores</h2>
                <p className="text-center text-white mb-4">
                    Aquí encuentras información sobre los directores y puedes gestionar esta información
                </p>
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
                            <div className="d-flex justify-content-end mb-2">
                                <Button variant="primary" onClick={() => handleShowModal()} className="d-flex align-items-center gap-2 new-director-button">
                                    <FaPlus /> Agregar
                                </Button>
                            </div>
                            <Table striped bordered hover style={{ width: '70%', margin: '0 auto' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '25%' }}>Nombre</th>
                                        <th style={{ width: '25%' }}>Apellido</th>
                                        <th style={{ width: '25%' }}>País</th>
                                        <th style={{ width: '25%' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {directores.map((director) => (
                                        <tr key={director.id}>
                                            <td>{director.nombre}</td>
                                            <td>{director.apellido}</td>
                                            <td>{director.pais.nombre || 'No especificado'}</td>
                                            <td>
                                                <FaEye className="icon fa-eye" onClick={() => handleShowDetails(director)} title="Ver detalles" />
                                                <FaEdit className="icon fa-edit" onClick={() => handleShowModal(director)} title="Editar" />
                                                <FaTrash className="icon fa-trash" onClick={() => handleDelete(director.id)} title="Eliminar" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>

                <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center w-100">Detalles del Director</Modal.Title>
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
                    <Modal.Footer className="d-flex justify-content-center">
                        <Button variant="danger" onClick={handleCloseDetailsModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="text-center w-100">
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
            </div>
        </div>
    );
};

export default Directores; 