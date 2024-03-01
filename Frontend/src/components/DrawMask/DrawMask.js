import React, { useState } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload.js';
import '../DrawMask/Draw.css'; // Ensure the path is correct

const DrawMask = () => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [maskedImageUrl, setMaskedImageUrl] = useState('');

    // Function to handle successful image upload
    const handleImageUploadSuccess = (url) => {
        setUploadedImageUrl(url); // Update state with the uploaded image URL
    };

    return (
        <div className="drawing-wrapper">
            {/* <div className="drawing-header">
                <h1>Draw Mask on Image</h1>
            </div> */}
            <div className="drawing-container">
                <div className="image-container">
                  {uploadedImageUrl ? (
                      <img className='original-img'
                          src={uploadedImageUrl}
                          alt="Uploaded"
                      />
                  ) : (
                      <div className="image-placeholder">Upload character here</div>
                  )}
                </div>
                
                <div className="image-container">
                {maskedImageUrl ? (
                    <img className='mask-img'
                    src={maskedImageUrl} alt="Masked" />
                ) : (
                    <div>Masked image will appear here</div>
                )}
                </div>
                </div>
                <ImageUpload onUploadSuccess={handleImageUploadSuccess} />
            <div className="tools-section">
                <button onClick={() => console.log('Add mask')}>Add Mask</button>
                <button onClick={() => console.log('Remove mask')}>Remove Mask</button>
            </div>
        </div>
    );
};

export default DrawMask;
