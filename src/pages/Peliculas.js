import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Peliculas = () => {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [paises, setPaises] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [actores, setActores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        reseña: '',
        portadaUrl: '',
        trailerYoutube: '',
        generoId: '',
        paisId: '',
        directorId: '',
        actoresIds: []
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            await cargarPeliculas();
            await cargarGeneros();
            await cargarPaises();
            await cargarDirectores();
            await cargarActores();
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated]);

    const cargarPeliculas = async () => {
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

    const cargarGeneros = async () => {
        try {
            const response = await api.get('/generos');
            setGeneros(response.data.$values || []);
        } catch (error) {
            toast.error('Error al cargar los géneros');
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

    const cargarDirectores = async () => {
        try {
            const response = await api.get('/directores');
            setDirectores(response.data.$values || []);
        } catch (error) {
            toast.error('Error al cargar los directores');
        }
    };

    const cargarActores = async () => {
        try {
            const response = await api.get('/actores');
            setActores(response.data.$values || []);
        } catch (error) {
            toast.error('Error al cargar los actores');
        }
    };

    const handleShowModal = (pelicula = null) => {
        if (pelicula) {
            setPeliculaSeleccionada(pelicula);
            setFormData({
                titulo: pelicula.titulo,
                reseña: pelicula.reseña,
                portadaUrl: pelicula.portadaUrl,
                trailerYoutube: pelicula.trailerYoutube,
                generoId: pelicula.generoId.toString(),
                paisId: pelicula.paisId.toString(),
                directorId: pelicula.directorId.toString(),
                actoresIds: pelicula.actores?.$values?.map(a => a.id.toString()) || []
            });
        } else {
            setPeliculaSeleccionada(null);
            setFormData({
                titulo: '',
                reseña: '',
                portadaUrl: '',
                trailerYoutube: '',
                generoId: '',
                paisId: '',
                directorId: '',
                actoresIds: []
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPeliculaSeleccionada(null);
        setFormData({
            titulo: '',
            reseña: '',
            portadaUrl: '',
            trailerYoutube: '',
            generoId: '',
            paisId: '',
            directorId: '',
            actoresIds: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleActorChange = (e) => {
        const { options } = e.target;
        const selectedActores = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedActores.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            actoresIds: selectedActores
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validar si la película ya existe solo al crear
            if (!peliculaSeleccionada) {
                const existingPelicula = peliculas.find(p => p.titulo === formData.titulo);
                if (existingPelicula) {
                    toast.error('La película ya existe');
                    return;
                }
            }

            const peliculaData = {
                titulo: formData.titulo,
                reseña: formData.reseña,
                portadaUrl: formData.portadaUrl,
                trailerYoutube: formData.trailerYoutube,
                generoId: parseInt(formData.generoId),
                paisId: parseInt(formData.paisId),
                directorId: parseInt(formData.directorId),
                actoresIds: formData.actoresIds.map(id => parseInt(id))
            };

            if (peliculaSeleccionada) {
                await api.put(`/peliculas/${peliculaSeleccionada.id}`, peliculaData);
                toast.success('Película actualizada exitosamente');
            } else {
                await api.post('/peliculas', peliculaData);
                toast.success('Nueva película creada exitosamente');
            }
            handleCloseModal();
            cargarPeliculas();
        } catch (error) {
            toast.error('Error al guardar la película');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta película?')) {
            try {
                await api.delete(`/peliculas/${id}`);
                toast.success('Película eliminada exitosamente');
                cargarPeliculas();
            } catch (error) {
                toast.error('Error al eliminar la película');
            }
        }
    };

    const extractYoutubeCode = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const handleViewDetails = (pelicula) => {
        setPeliculaSeleccionada(pelicula);
        setFormData({
            titulo: pelicula.titulo,
            reseña: pelicula.reseña,
            portadaUrl: pelicula.portadaUrl,
            trailerYoutube: pelicula.trailerYoutube,
            generoId: pelicula.generoId.toString(),
            paisId: pelicula.paisId.toString(),
            directorId: pelicula.directorId.toString(),
            actoresIds: pelicula.actores?.$values?.map(a => a.id.toString()) || []
        });
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setPeliculaSeleccionada(null);
    };

    return (
        <div className="custom-container">
            <h2 className="text-center mb-4" style={{ color: '#6c757d' }}>
                Gestión de Películas
            </h2>
            <div className="d-flex justify-content-end mb-4">
                <Button 
                    variant="primary" 
                    onClick={() => handleShowModal()}
                    className="d-flex align-items-center gap-2 new-director-button"
                >
                    <FaPlus /> Nueva Película
                </Button>
            </div>
            
            <div className="peliculas-table-wrapper">
                <div className="row" style={{ marginTop: '30px' }}>
                    {loading ? (
                        <div className="col-12 text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                            <p>Cargando...</p>
                        </div>
                    ) : (
                        peliculas.length > 0 ? (
                            peliculas.map((pelicula) => (
                                <div className="col-md-4 mb-4" key={pelicula.id} onDoubleClick={() => handleViewDetails(pelicula)}>
                                    <div className="card shadow-sm pelicula-card" style={{ height: '100%' }}>
                                        <div className="card-body">
                                            <h5 className="card-title">{pelicula.titulo}</h5>
                                            <p className="card-text"><strong>Director:</strong> {pelicula.directorNombre}</p>
                                            <p className="card-text"><strong>Género:</strong> {pelicula.generoNombre}</p>
                                            <p className="card-text"><strong>País:</strong> {pelicula.paisNombre}</p>
                                            <p className="card-text">{pelicula.reseña.length > 50 ? `${pelicula.reseña.substring(0, 50)}...` : pelicula.reseña}</p>
                                            {pelicula.trailerYoutube && (
                                                <div className="text-center">
                                                    <iframe
                                                        width="100%"
                                                        height="200"
                                                        src={`https://www.youtube.com/embed/${extractYoutubeCode(pelicula.trailerYoutube)}`}
                                                        title="YouTube video player"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-footer">
                                            <div className="d-flex justify-content-between">
                                                <Button 
                                                    variant="outline-info" 
                                                    onClick={() => handleViewDetails(pelicula)}
                                                >
                                                    Ver Más
                                                </Button>
                                                <div>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleShowModal(pelicula)}
                                                        className="me-2"
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleDelete(pelicula.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">No hay películas disponibles</div>
                        )
                    )}
                </div>
            </div>

            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" className="modal-fullscreen">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">{peliculaSeleccionada?.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-scroll">
                    <div className="text-center">
                        <img 
                            src={peliculaSeleccionada?.portadaUrl || "/images/portada1.jpg"} 
                            alt="Portada" 
                            className="img-fluid mb-3" 
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                    <div>
                        <span>Reseña: {peliculaSeleccionada?.reseña}</span><br />
                        <span>Director: {peliculaSeleccionada?.directorNombre}</span><br />
                        <span>Género: {peliculaSeleccionada?.generoNombre}</span><br />
                        <span>País: {peliculaSeleccionada?.paisNombre}</span><br />
                        <span>Actores:</span>
                        {peliculaSeleccionada?.actores?.$values?.map((actor, index) => (
                            <div 
                                key={actor.id} 
                                style={{ 
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff', // Alterna entre gris claro y blanco
                                    padding: '5px', // Espaciado para que se vea mejor
                                    borderRadius: '5px' // Bordes redondeados
                                }}
                            >
                                {actor.nombre} {actor.apellido}
                            </div>
                        ))}
                    </div>
                    <h5>Tráiler</h5>
                    {peliculaSeleccionada?.trailerYoutube && (
                        <div className="text-center">
                            <iframe
                                width="100%"
                                height="200"
                                src={`https://www.youtube.com/embed/${extractYoutubeCode(peliculaSeleccionada.trailerYoutube)}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseDetailsModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="text-center w-100">
                        {peliculaSeleccionada ? 'Editar Película' : 'Nueva Película'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Reseña</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="reseña"
                                        value={formData.reseña}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa', height: '150px' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Portada URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="portadaUrl"
                                        value={formData.portadaUrl}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código de Tráiler (YouTube)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trailerYoutube"
                                        value={formData.trailerYoutube}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    />
                                    {formData.trailerYoutube && (
                                        <div className="mt-2">
                                            <iframe
                                                width="100%"
                                                height="200"
                                                src={`https://www.youtube.com/embed/${extractYoutubeCode(formData.trailerYoutube)}`}
                                                title="YouTube video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select
                                        name="generoId"
                                        value={formData.generoId}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    >
                                        <option value="">Seleccione un género</option>
                                        {generos.map((genero) => (
                                            <option key={genero.id} value={genero.id}>
                                                {genero.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Actores</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="actoresIds"
                                        value={formData.actoresIds}
                                        onChange={handleActorChange}
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa', height: '150px' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    >
                                        {actores.map((actor) => (
                                            <option key={actor.id} value={actor.id}>
                                                {actor.nombre} {actor.apellido}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>País</Form.Label>
                                    <Form.Select
                                        name="paisId"
                                        value={formData.paisId}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    >
                                        <option value="">Seleccione un país</option>
                                        {paises.map((pais) => (
                                            <option key={pais.id} value={pais.id}>
                                                {pais.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Director</Form.Label>
                                    <Form.Select
                                        name="directorId"
                                        value={formData.directorId}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '5px', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}
                                        onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                        onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    >
                                        <option value="">Seleccione un director</option>
                                        {directores.map((director) => (
                                            <option key={director.id} value={director.id}>
                                                {director.nombre} {director.apellido}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Button variant="danger" onClick={handleCloseModal}>
                            Cancelar
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

export default Peliculas; 