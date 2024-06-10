import React, { useState } from 'react';
import Logo from './Logo'; // Assuming you have a Logo component
import './ref.css'; // Ensure this CSS file exists and styles elements appropriately

function RefineCharacter() {
    const [textPrompt, setTextPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            setError('Please select an image file.');
            return;
        }

        setLoading(true);
        setError('');
        setResultImage('');
        setProgress(0);

        try {
            const payload = {
                refine_text_prompt: textPrompt,
                image_data: image
            };

            const response = await fetch('/refine-character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to refine image');

            setResultImage(data.path);
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">Upload and Preview</h1>
                            <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} />
                            <br></br><br></br><br></br>
                            {image && <img src={image} alt="Uploaded Preview" className="img-fluid" />}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                        
                            <h1 className="card-title">Text Prompt Here!</h1>
                            
                       
                        <div className="header-button-group">
                            <textarea className="form-control mb-3" placeholder="Enter text prompt here..." rows="3"
                                      value={textPrompt} onChange={(e) => setTextPrompt(e.target.value)} />
                            <button onClick={handleSubmit} className="btn-ref" disabled={loading}>Refine</button>
                            </div>
                            {loading && <div className="mt-3"><Logo /><div>Processing...</div></div>}
                            {error && <div className="text-danger mt-3">{error}</div>}
                            {resultImage && (
                                <>
                                    <br></br>
                                    <img src={resultImage} alt="Refined Image" className="img-fluid mt-3" />
                                    <br></br>
                                    <a href={resultImage} download="C:\\Users\\PC\\OneDrive\\Desktop\\aima_stat\\night-before-fair\\aima-improved-react\\frontend\\public\\RefinedImage.png" className="btn btn-success mt-3">Download Result</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RefineCharacter;
