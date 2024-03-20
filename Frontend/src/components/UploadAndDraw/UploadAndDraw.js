// src/components/UploadAndDraw/UploadAndDraw.js
import React, { useState } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload.js';
import DrawMask from '../DrawMask/DrawMask.js'; // Ensure this is the correct import

const UploadAndDraw = () => {
  const [uploadedImage, setUploadedImage] = useState({ url: '', filename: '' });

  const handleUploadSuccess = (url) => {
    // Extract filename from URL
    const filename = url.split('/').pop();
    setUploadedImage({ url, filename });
  };

  // const handleMaskApplied = (newUrl) => {
  //   // Append a timestamp to the URL as a query parameter
  //   const timestamp = new Date().getTime(); // Generate timestamp
  //   const cacheBustedUrl = `${newUrl}?${timestamp}`;
  //   setUploadedImage({ ...uploadedImage, url: cacheBustedUrl });
  // };
  const handleMaskApplied = (newUrl) => {
    const cacheBustedUrl = newUrl; // Remove the empty string concatenation
    setUploadedImage({ ...uploadedImage, url: cacheBustedUrl });
  };

  return (
    <div>
      <ImageUpload onUploadSuccess={handleUploadSuccess} />
      {uploadedImage.url && (
      <DrawMask
      imageUrl={uploadedImage.url}
      filename={uploadedImage.filename}
      onMaskApplied={handleMaskApplied} // Use the adjusted handler here
    />
      )}
    </div>
  );
};

export default UploadAndDraw;
