import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('Intentando login con:', credentials);
            const response = await api.post('/auth/login', credentials);
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('¡Inicio de sesión exitoso!');
                navigate('/welcome');
            } else {
                toast.error('Error: Respuesta del servidor inválida');
            }
        } catch (error) {
            console.error('Error completo:', error);
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.response) {
                console.log('Error response:', error.response);
                if (error.response.status === 401) {
                    errorMessage = 'Usuario o contraseña incorrectos';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor';
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100" 
                            style={{ padding: '10px' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login; 