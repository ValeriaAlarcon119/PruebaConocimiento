import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Paises = () => {
    const navigate = useNavigate();
    const [paises, setPaises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [paisSeleccionado, setPaisSeleccionado] = useState(null);
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
            await cargarPaises();
            await cargarPeliculas();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    const cargarPaises = async () => {
        try {
            const response = await api.get('/paises');
            setPaises(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login');
            } else {
                toast.error('Error al cargar los países');
            }
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

    const handleShowModal = (pais = null) => {
        if (pais) {
            setPaisSeleccionado(pais);
            setFormData({
                nombre: pais.nombre
            });
        } else {
            setPaisSeleccionado(null);
            setFormData({
                nombre: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPaisSeleccionado(null);
        setFormData({
            nombre: ''
        });
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setPaisSeleccionado(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleShowDetails = (pais) => {
        setPaisSeleccionado(pais);
        setShowDetailsModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar si ya existe un país con el mismo nombre
            const paisExistente = paises.find(
                p => p.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    p.id !== paisSeleccionado?.id
            );

            if (paisExistente) {
                toast.error('Ya existe un país con este nombre');
                return;
            }

            if (paisSeleccionado) {
                await api.put(`/paises/${paisSeleccionado.id}`, formData);
                toast.success('País actualizado exitosamente');
            } else {
                await api.post('/paises', formData);
                toast.success('País creado exitosamente');
            }
            handleCloseModal();
            cargarPaises();
        } catch (error) {
            toast.error('Error al guardar el país');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Verificar si el país está en uso en películas
            const paisEnUso = peliculas.some(pelicula => pelicula.paisId === id);

            if (paisEnUso) {
                toast.error('No es permitido borrar este país porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este país?')) {
                await api.delete(`/paises/${id}`);
                toast.success('País eliminado exitosamente');
                cargarPaises();
            }
        } catch (error) {
            toast.error('Error al eliminar el país');
        }
    };

    return (
        <div className="custom-container">
            <h2 className="text-center mb-4" style={{ color: '#6c757d' }}>Gestión de Países</h2>
            
            <div className="table-wrapper">
                <div className="button-container">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()}
                        className="d-flex align-items-center gap-2 new-director-button"
                    >
                        <FaPlus /> Nuevo País
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
                            {paises.length > 0 ? (
                                paises.map((pais) => (
                                    <tr key={pais.id} className="text-center">
                                        <td>{pais.nombre}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(pais)}
                                                    className="p-2"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(pais.id)}
                                                    className="p-2"
                                                >
                                                    <FaTrash />
                                                </Button>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm"
                                                    onClick={() => handleShowDetails(pais)}
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
                                    <td colSpan="2" className="text-center">No hay países disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edición/Creación */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {paisSeleccionado ? 'Editar País' : 'Nuevo País'}
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

            {/* Modal de Detalles */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del País</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={paisSeleccionado?.nombre || ''}
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

export default Paises; 