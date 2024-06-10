import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './customize.css';
import Logo from './Logo'
function CustomizeImage() { 
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const location = useLocation();
    const inputImagePath = location.state?.inputImagePath;
    const [textPrompt, setTextPrompt] = useState('');
    const [customizedImage, setCustomizedImage] = useState(null);
    
    const [error, setError] = useState('');

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + 2;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return newProgress;
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [loading]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputImagePath) {
            setError("Image path is not set.");
            return;
        }

        setLoading(true);
        setError('');
        setCustomizedImage(null);

        const payload = {
            text_prompt: textPrompt,
            input_img_path: inputImagePath  // Use the path from props
        };

        console.log("Payload for /customize-image:", payload);

        fetch('/customize-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to customize image. Status: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.customized_image) {
                setCustomizedImage(data.customized_image);
            } else {
                setError('No image path returned from server.');
            }
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
            setProgress(0); 
        });
    };

    return (
     
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                  
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="text-prompt" className="form-label">Enter Text Prompt:</label>
                            <br></br><br></br><br></br>
                            <textarea
                                        className="form-control"
                                        id="text-prompt"
                                        rows="3"  // Specifies the visible number of lines in a text area
                                        value={textPrompt}
                                        onChange={(e) => setTextPrompt(e.target.value)}
                                    />
                            <br></br>
                        </div>
                        <button type="submit" className="btn-cus" disabled={loading}>
                            Customize Image
                        </button>
                    </form>
                </div>
            </div>
            <div className="result-img-cont">
            {loading && (
                            <>
                              
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p>Loading... {progress}%</p>
                                <Logo />
                            </>
                        )}
                        {error && <p className="text-danger">{error}</p>}
                        {customizedImage && <img src={customizedImage} alt="Customized" className="result-img" />}
                    </div>
        </div>
    );
}

export default CustomizeImage;
