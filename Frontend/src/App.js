import React from 'react';
import NavBar from './components/NavBar/NavBar';
import Home from './Pages/Homepage/Home';
import DrawMask from './components/DrawMask/DrawMask'; // Ensure this path is correct
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    
    <Router>
      <div className="navcontainer">
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Exact is no longer needed */}
        <Route path="/draw-mask" element={<DrawMask />} />
      </Routes>
    </Router>
  );
}

export default App;
