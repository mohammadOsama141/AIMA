// src/components/ImageDisplay/ImageDisplay.js
import React from 'react';

const ImageDisplay = ({ imageUrl }) => {
  return (
    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
  );
};

export default ImageDisplay;
