import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
    Phone, 
    Mail, 
    MapPin, 
    MessageSquare,
    Globe
} from 'lucide-react';
import { 
    FaFacebook as Facebook, 
    FaInstagram as Instagram, 
    FaLinkedin as Linkedin 
} from 'react-icons/fa';
import '../App.css';

const Contacto = () => {
    const title = "CANALES DE CONEXIÓN";

    // ANIMATION VARIANTS
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const letterVariants = {
        hidden: { opacity: 0, scale: 1.1, filter: "blur(15px)", y: 10 },
        visible: { 
            opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, scale: 1, y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const contacts = [
        { icon: Facebook, label: 'Facebook', link: 'https://facebook.com/elitestream', desc: 'Comunidad Oficial', color: '#1877F2' },
        { icon: Instagram, label: 'Instagram', link: 'https://instagram.com/elitestream', desc: 'Galería de Estrenos', color: '#E4405F' },
        { icon: Linkedin, label: 'LinkedIn', link: 'https://linkedin.com/company/elitestream', desc: 'Red Profesional', color: '#0A66C2' },
        { icon: Phone, label: 'Soporte Directo', link: 'tel:+573123456789', desc: '+57 312 3456789', color: '#25D366' },
        { icon: Mail, label: 'Consultas', link: 'mailto:info@elitestream.com', desc: 'info@elitestream.com', color: '#EA4335' },
        { icon: MessageSquare, label: 'Telegram', link: 'https://t.me/elitestream', desc: '@elitestream_hq', color: '#0088CC' }
    ];

    return (
        <div style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '60px 0' }}>
            <Container>
                <div className="text-center mb-5">
                    <motion.div initial="hidden" animate="visible" variants={titleVariants} className="d-flex justify-content-center gap-1">
                        {title.split("").map((char, index) => (
                            <motion.span 
                                key={index} 
                                variants={letterVariants}
                                className="page-title mb-0" 
                                style={{ 
                                    fontSize: '5rem', 
                                    fontWeight: '900', 
                                    letterSpacing: '-2px',
                                    display: 'inline-block'
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.div>
                    <p className="text-dim extra-small text-uppercase mt-2" style={{ letterSpacing: '10px' }}>
                        Global Network Access Points
                    </p>
                    <div className="mx-auto mt-4" style={{ height: '2px', width: '60px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)' }} />
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="row g-4 justify-content-center mt-5"
                >
                    {contacts.map((item, index) => (
                        <Col key={index} xl={4} lg={4} md={6}>
                            <motion.a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                variants={itemVariants}
                                whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                className="text-decoration-none"
                                style={{ display: 'block' }}
                            >
                                <Card className="premium-modal border-0 h-100 p-4" style={{ 
                                    background: 'rgba(15, 15, 15, 0.4)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}>
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                                            <item.icon size={28} style={{ color: item.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-white h5 fw-bold mb-1" style={{ letterSpacing: '1px' }}>{item.label}</h3>
                                            <p className="text-dim extra-small m-0 text-uppercase" style={{ letterSpacing: '2px' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.a>
                        </Col>
                    ))}
                </motion.div>

                <Row className="mt-5 pt-5 g-5">
                    <Col lg={6}>
                        <div className="p-5 rounded-5" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-3">
                                <Globe size={24} className="text-primary" /> HUB CENTRAL
                            </h4>
                            <p className="text-dim fw-light mb-4" style={{ lineHeight: '1.8' }}>
                                Nuestra infraestructura digital opera desde nodos distribuidos globalmente para garantizar la máxima fidelidad en el streaming cinematográfico.
                            </p>
                            <div className="d-flex align-items-center gap-3 text-white-50">
                                <MapPin size={18} className="text-primary" />
                                <span className="extra-small text-uppercase" style={{ letterSpacing: '2px' }}>Distrito Tecnológico, Nariño, COL</span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="d-flex align-items-center justify-content-center">
                        <div className="text-center opacity-40">
                            <MessageSquare size={80} className="text-primary mb-4" />
                            <p className="text-dim extra-small text-uppercase" style={{ letterSpacing: '5px' }}>Encriptación de Extremo a Extremo</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contacto;
