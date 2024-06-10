import React from 'react';
import NavBar from './components/NavBar/NavBar';
import Home from './Pages/Homepage/Home';
import UploadAndDraw from './components/UploadAndDraw/UploadAndDraw';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="navcontainer">
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw-mask" element={<UploadAndDraw />} />
      </Routes>
    </Router>
  );
}
export default App;
