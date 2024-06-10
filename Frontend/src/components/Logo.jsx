import React from 'react';
import './logo.css'; // Ensure the styles above are included in this CSS file

function Logo() {
    return (
        <div className="triangle-container">
            <img src="A-of-aima.png" alt="Animated Logo 1" className="logo-position logo-top centered-image" />
            <img src="A-of-aima.png" alt="Animated Logo 2" className="logo-position logo-bottom-left centered-image" />
            <img src="A-of-aima.png" alt="Animated Logo 3" className="logo-position logo-bottom-right centered-image" />
        </div>
    );
}

export default Logo;
