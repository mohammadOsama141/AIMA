import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './nav.css';  // Make sure your CSS file is correctly referenced

function NavbarComponent() {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Navbar className={`navbar-custom ${scrolled ? 'scrolled' : ''}`} expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand className="navbar-brand-custom" href="">
                    <img
                        src="A-of-aima.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                    A I M A
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/generate-poses">Generate</Link>
                    <Link className="nav-link" to="/draw-mask">Customize</Link>
                    <Link className="nav-link" to="/refine-character">Refine</Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
