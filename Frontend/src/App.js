import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/Navbar';
import Home from './components/Home';
import DrawMask from './components/Drawmask'; // Ensure you import DrawMask if you want to route to it
import CustomizeImage from './components/Customize';
import GeneratePoses from './components/GenPoses';
import  RefineCharacter from './components/Refine'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <NavbarComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/draw-mask" element={<DrawMask />} />
                <Route path="/customize-image" element={<CustomizeImage />} />
                <Route path="/generate-poses" element={<GeneratePoses />} />
                <Route path="/refine-character" element={< RefineCharacter />}/>
                {/* You can add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
