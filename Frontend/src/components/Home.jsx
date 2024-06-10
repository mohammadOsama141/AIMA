import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Assuming your CSS is correctly linked

function Home() {
    const navigate = useNavigate();

    // Smooth scroll to elements
    const handleButtonClick = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleCustomizeClick = () => {
    navigate('draw-mask');
};
    const handleRefineClick = () => {
        navigate('refine-character');
    };
    const handleTurnAroundClick = () => {
        navigate('generate-poses');
    };

    return (
        <div className="home-wrapper">
            <section className="intro-section">
                <div className="home-description-block">
                    <div className="intro-badge-container">
                        <span className="badge-text">Powered By Advanced AI Models</span>
                        
                    </div>
                    <br></br><br></br>
                    <h1 className="home-heading">AI Modeling Assistant</h1>
                    <p className="intro-text">
                        Streamline Character Design Poses and customizations With Automated Concept Art Modeling — where your imagination meets our technology to redefine animated storytelling.
                    </p>
                    <br></br>
                    <button className="try-aima-action-button" onClick={() => handleButtonClick('.section1')}>TRY AIMA</button>
                </div>
                <div className='vdo-container'>
                    <video className="demo-vdo-class" playsInline autoPlay loop>
                        <source src="aima-1s-vdo.mp4" type="video/mp4"/>
                    </video>
                </div>
            </section>
            <br></br><br></br>
            {/* Adding navigation cards */}
            <div className="container mt-4">
                <div className="row">
                    {/* First card */}
                    <div className="col-md-4">
                        <div className="card" onClick={() => handleButtonClick('.section1')}>
                            <img src="/sheets-collage.png" className="card-img-top" alt="Generate Turnaround Sheet" />
                            <div className="card-body">
                                <h5 className="card-title">Generate Turnaround Sheets</h5>
                                {/* <p className="card-text">Create views of your character from multiple angles.</p> */}
                            </div>
                        </div>
                    </div>
                    
                    {/* Second card */}
                    <div className="col-md-4">
                        <div className="card" onClick={() => handleButtonClick('.section2')}>
                            <img src="masking.png" className="card-img-top" alt="Customize Characters" />
                            <div className="card-body">
                                <h5 className="card-title">Customize Characters</h5>
                                {/* <p className="card-text">Modify your characters with advanced tools.</p> */}
                            </div>
                        </div>
                    </div>
                    {/* Third card */}
                    <div className="col-md-4">
                        <div className="card" onClick={() => handleButtonClick('.section3')}>
                            <img src="og-vs-refine.png" className="card-img-top" alt="Refine Characters" />
                            <div className="card-body">
                                <h5 className="card-title">Refine Character Designs</h5>
                                {/* <p className="card-text">Turn your rough sketches into HD characters</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <section className='section1'>
                <div className='sec1-description-block'>
                    <h1>Generate Turnaround Sheets</h1>
                    <p>Wrap up your long due character design with a few English words!
                Generate detailed character turaround sheets based on your own text descriptions </p>
                    <button type="button" onClick={handleTurnAroundClick} className="btn-turnaround">
                    Generate
                    </button>
                </div>
            </section>
            <section className='section2'>
                <div className='sec2-description-block'>
                    <h1>Customize Characters</h1>
                    <p>Select specific areas of your character image for customization —
                        add, modify, or remove features as desired through a user-friendly brush tool.</p>
                    <button type="button" onClick={handleCustomizeClick} className="btn-customize">
                        Customize Character
                    </button>
                </div>
            </section>
            <section className='section3'>
                <div className='sec3-description-block'>
                    <h1>Refine Characters</h1>
                    <p>Make your character designs more visually appealing, Enhance the look and feel of your charcters with just a click!</p>
                    <button type="button" onClick={handleRefineClick} className="btn-refine">
                    Refine
                    </button>
                   
                    <br></br> <br></br>
                   
                </div>
            </section>
        </div>
    );
}

export default Home;
