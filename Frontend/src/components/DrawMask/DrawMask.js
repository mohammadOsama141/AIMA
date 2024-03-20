// src/components/DrawMask/DrawMask.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../DrawMask/Draw.css'
const DrawMask = ({ imageUrl, filename, onMaskApplied }) => {
  const [maskedImageUrl, setMaskedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Received imageUrl from UploadAndDraw.js:", imageUrl);
  const [isDrawing, setIsDrawing] = useState(false);
  const [action, setAction] = useState('add'); // 'add' or 'remove'
  const imageRef = useRef(null);
  
  const startDrawing = (event) => {
    setIsDrawing(true);
    getMousePosition(event);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getMousePosition = (event) => {
    if (!isDrawing) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    sendPoint(x, y, action);
  };


  const sendPoint = async (x, y, action) => {
    try 
    {
      setIsLoading(true); 
      const response = await axios.post('http://localhost:8000/draw_mask', {
        filename,
        point: { x, y },
        action
      });
      console.log("Backend response:", response.data);
      setMaskedImageUrl(response.data.image_path);
      imageRef.current.src = response.data.image_path;
      onMaskApplied(response.data.image_path);
    } 
    catch (error) 
    {
      console.error('Error applying mask:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (maskedImageUrl) {
      console.log("Updated maskedImageUrl:", maskedImageUrl);
    }
  }, [maskedImageUrl]);
  return (
    <div className="mask-drawing-container">
      <div className='image-container'>
      <div className="mask-drawing-buttons">
        <button onClick={() => setAction('add')} className="mask-button add-mask">Add Mask</button>
        <button onClick={() => setAction('remove')} className="mask-button remove-mask">Remove Mask</button>
      </div>
      <img
      ref={imageRef}
      src={imageUrl}
      alt=""
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onMouseMove={getMousePosition}
      className="actual-image"
      draggable="false"
  />
  </div>
  <div className="mask-container">
        {isLoading ? (
          <div className="loading-overlay">Loading...</div> // Display loading indicator while processing
        ) : (
          <img
            src={maskedImageUrl} // Masked image
            alt="Mask"
            className="masked-image"
            draggable="false"
          />
        )}
      </div>
    </div>
  );
};

export default DrawMask;
