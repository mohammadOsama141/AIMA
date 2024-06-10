import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './draw.css';

function DrawMask() {
    
    const navigate = useNavigate();

// Function to handle navigation
const handleCustomizeNavigation = () => {
    navigate('/customize-image', { state: { inputImagePath: imagePath } });
};

    const [isDrawing, setIsDrawing] = useState(false);
    const [action, setAction] = useState('add');
    const [imagePath, setImagePath] = useState('');
    const [points, setPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [scaleX, setScaleX] = useState(1); // Define scaleX state
    const [scaleY, setScaleY] = useState(1); // Define scaleY state
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);

    useEffect(() => {
        const image = new Image();
        image.src = imagePath;
        image.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const displayWidth = Math.min(image.width, canvas.parentNode.clientWidth);
            const displayHeight = (image.height / image.width) * displayWidth;
    
            canvas.width = displayWidth;
            canvas.height = displayHeight;
    
            context.drawImage(image, 0, 0, displayWidth, displayHeight);
            
            // Update scaleX and scaleY based on the loaded image and display dimensions
            setScaleX(image.width / displayWidth);
            setScaleY(image.height / displayHeight);
        };
    }, [imagePath]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);
        fetch('http://localhost:8000/upload-image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            setImagePath(data.filename);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to upload image');
        })
        .finally(() => setIsLoading(false));
    };

    const startDrawing = (event) => {
        event.preventDefault();
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        sendPointsToServer();
    };

    const drawOnCanvas = (x, y) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const brushSize = 10;
        const color = action === 'add' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)';
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, brushSize, 0, 2 * Math.PI);
        context.fill();
        setPoints(prevPoints => [...prevPoints, { x: x * scaleX, y: y * scaleY, action }]); // Store scaled points
    };

    const getMousePosition = (event) => {
        if (!isDrawing || !imagePath) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left);
        const y = (event.clientY - rect.top);
        drawOnCanvas(x, y);
    };

    const sendPointsToServer = () => {
        if (points.length > 0) {
            fetch('http://localhost:8000/process-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points, image_path: imagePath }),
            })
            .then(response => response.json())
            .then(data => {
                updateMaskCanvas(data.mask_path);
                setPoints([]); // Clear points after sending
            })
            .catch(error => {
                console.error('Error processing points:', error);
            });
        }
    };

    const updateMaskCanvas = (maskImageUrl) => {
        const maskCanvas = maskCanvasRef.current;
        const context = maskCanvas.getContext('2d');
        const image = new Image();
        image.src = maskImageUrl;
        image.onload = () => {
            context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            context.drawImage(image, 0, 0, maskCanvas.width, maskCanvas.height);
        };
    };

    return (
        <div className="content-wrapper">
            <div className="tool-section">
                <button className='action-buttons' disabled={isLoading} onClick={() => setAction('add')}>+</button>
                <button className='action-buttons' disabled={isLoading} onClick={() => setAction('remove')}>-</button>
            </div>
            <div className="input-img-container">
                
                <div >
                    <canvas ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onMouseMove={getMousePosition}
                        draggable="false"
                    />
                </div>
                
                <div className='upload-image-class'>
                    <input type="file" onChange={handleImageUpload} disabled={isLoading} style={{ border:'2pt solid white' , padding:'10px'}}/>
                    
                </div>
            </div>
            <div className='mask-img-container'>
                <canvas ref={maskCanvasRef} draggable="false" />
                <br></br><br></br>
                <div>
                <button className='continue-customize-class' onClick={handleCustomizeNavigation} disabled={isLoading}>Continue Customizing</button>
            </div>
            </div>
           
        </div>
    );
}

export default DrawMask;
