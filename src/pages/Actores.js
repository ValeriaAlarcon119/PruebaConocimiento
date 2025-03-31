import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Actores = () => {
    const navigate = useNavigate();
    const [actores, setActores] = useState([]);
    const [paises, setPaises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [actorSeleccionado, setActorSeleccionado] = useState(null);
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
            await cargarActores();
            await cargarPaises();
            await cargarPeliculas();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    const cargarActores = async () => {
        try {
            const response = await api.get('/actores');
            setActores(response.data.$values || []);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                navigate('/login');
            } else {
                toast.error('Error al cargar los actores');
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

    const handleShowModal = (actor = null) => {
        if (actor) {
            setActorSeleccionado(actor);
            setFormData({
                nombre: actor.nombre,
                apellido: actor.apellido,
                paisId: actor.paisId.toString()
            });
        } else {
            setActorSeleccionado(null);
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
        setActorSeleccionado(null);
        setFormData({
            nombre: '',
            apellido: '',
            paisId: ''
        });
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setActorSeleccionado(null);
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
            // Verificar si ya existe un actor con el mismo nombre y apellido
            const actorExistente = actores.find(
                a => a.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
                    a.apellido.toLowerCase() === formData.apellido.toLowerCase() &&
                    a.id !== actorSeleccionado?.id
            );

            if (actorExistente) {
                toast.error('Ya existe un actor con este nombre y apellido');
                return;
            }

            const actorData = {
                id: actorSeleccionado ? actorSeleccionado.id : 0,
                nombre: formData.nombre,
                apellido: formData.apellido,
                paisId: parseInt(formData.paisId)
            };

            if (actorSeleccionado) {
                await api.put(`/actores/${actorSeleccionado.id}`, actorData);
                toast.success('Actor actualizado exitosamente');
            } else {
                await api.post('/actores', actorData);
                toast.success('Actor creado exitosamente');
            }
            handleCloseModal();
            cargarActores();
        } catch (error) {
            console.error("Error al guardar el actor:", error.response?.data || error.message);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al guardar el actor');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            // Verificar si el actor está en uso en películas
            const actorEnUso = peliculas.some(pelicula => 
                pelicula.actores?.$values?.some(actor => actor.id === id)
            );

            if (actorEnUso) {
                toast.error('No es permitido borrar este actor porque está en uso en la aplicación');
                return;
            }

            if (window.confirm('¿Estás seguro de que deseas eliminar este actor?')) {
                await api.delete(`/actores/${id}`);
                toast.success('Actor eliminado exitosamente');
                cargarActores();
            }
        } catch (error) {
            console.error("Error al eliminar actor:", error.response?.data || error.message);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('No se puede eliminar el actor porque está en uso.');
            }
        }
    };

    const handleShowDetails = (actor) => {
        setActorSeleccionado(actor);
        setShowDetailsModal(true);
    };

    return (
        <div className="custom-container">
            <h2 className="text-center mb-4" style={{ color: '#6c757d' }}>Gestión de Actores</h2>
            
            <div className="table-wrapper">
                <div className="button-container">
                    <Button 
                        variant="primary" 
                        onClick={() => handleShowModal()}
                        className="d-flex align-items-center gap-2 new-director-button"
                    >
                        <FaPlus /> Nuevo Actor
                    </Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '30px' }}>
                    <table className="table table-striped table-bordered shadow-sm">
                        <thead className="bg-light text-dark">
                            <tr>
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Apellido</th>
                                <th className="text-center">País</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actores.length > 0 ? (
                                actores.map((actor) => (
                                    <tr key={actor.id} className="text-center">
                                        <td>{actor.nombre}</td>
                                        <td>{actor.apellido}</td>
                                        <td>{paises.find(p => p.id === actor.paisId)?.nombre}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(actor)}
                                                    className="p-2"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(actor.id)}
                                                    className="p-2"
                                                >
                                                    <FaTrash />
                                                </Button>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm"
                                                    onClick={() => handleShowDetails(actor)}
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
                                    <td colSpan="4" className="text-center">No hay actores disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {actorSeleccionado ? 'Editar Actor' : 'Nuevo Actor'}
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
                    <Modal.Title>Detalles del Actor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={actorSeleccionado?.nombre || ''}
                                disabled={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                value={actorSeleccionado?.apellido || ''}
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

export default Actores; 