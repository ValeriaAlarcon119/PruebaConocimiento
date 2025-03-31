import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
            await cargarPaises();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchPeliculas = async () => {
            const response = await api.get('/peliculas');
            setPeliculas(response.data.$values || []);
        };
        fetchPeliculas();
    }, []);

    const cargarPaises = async () => {
        try {
            const response = await api.get('/paises');
            setPaises(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login'); // Redirige al login si la sesión ha expirado
            } else {
                toast.error('Error al cargar los países');
            }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const paisData = {
                id: paisSeleccionado ? paisSeleccionado.id : 0,
                nombre: formData.nombre
            };

            if (paisSeleccionado) {
                await api.put(`/paises/${paisSeleccionado.id}`, paisData);
                toast.success('País actualizado exitosamente');
            } else {
                await api.post('/paises', paisData);
                toast.success('Nuevo país creado exitosamente');
            }
            handleCloseModal();
            cargarPaises();
        } catch (error) {
            console.error("Error al guardar el país:", error.response?.data || error.message);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al guardar el país');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este país?')) {
            try {
                await api.delete(`/paises/${id}`);
                toast.success('País eliminado exitosamente');
                cargarPaises();
            } catch (error) {
                console.error("Error al eliminar país:", error.response?.data || error.message);
                if (error.response?.data?.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('No se puede eliminar el país porque está en uso.');
                }
            }
        }
    };

    const handleViewDetails = (pais) => {
        setPaisSeleccionado(pais);
        setFormData({
            nombre: pais.nombre
        });
        setShowModal(true);
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
                                                    onClick={() => handleViewDetails(pais)}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {paisSeleccionado ? 'Detalles del País' : 'Nuevo País'}
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
        </div>
    );
};

export default Paises; 