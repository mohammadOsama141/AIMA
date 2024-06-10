// src/components/ImageUpload.js
import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../ImageUpload/ImgUpload.css'
const ImageUpload = ({ onUploadSuccess }) => { // Accept a callback prop
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('Upload file');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name); // Update the file name in state
        }
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post(
                'http://localhost:8000/upload_image/',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert('Upload successful');
            onUploadSuccess(response.data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        }
    };
    return (
        <div className='file-container'>
        <div className="custom-file">
            <input 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            type="file" className="custom-file-input" id="customFile" onChange={handleFileChange} />
            <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
        </div>
       
            <button className="btn btn" onClick={handleUpload}>Confirm</button>
       
        </div>
    );
};

export default ImageUpload;
