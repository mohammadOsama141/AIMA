import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/A-of-aima.png';
import './Nav.css';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };

        // Add event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <nav className={`navbar bg-body-tertiary ${scrolled ? 'scrolled' : ''}`}>
               
                    <div className="container-fluid">
                        <div className="navbar-brand">
                            <img src={logo} alt="Logo" className="d-inline-block align-text-top"/>
                            <span>A I M A</span>
                        </div>
                    </div>
                </nav>
            
        </>
    );
}
