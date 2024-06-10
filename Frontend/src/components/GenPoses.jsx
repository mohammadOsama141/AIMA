import React, { useState } from 'react';
import './poses.css'; // Custom CSS for styling
import Logo from './Logo'; // Import the Logo component for animation

function GeneratePoses() {
    const [textPrompt, setTextPrompt] = useState('');
    const [artStyle, setArtStyle] = useState('GameArt'); // Default to 'GameArt'
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setResultImage('');
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress < 100) {
                    return prevProgress + 2;
                }
                clearInterval(interval);
                return prevProgress;
            });
        }, 200); // Simulate progress

        try {
            const response = await fetch('/generate-poses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text_prompt: textPrompt,
                    art_style: artStyle,
                }),
            });

            const data = await response.json();
            clearInterval(interval); // Stop the interval on fetch completion
            if (!response.ok) throw new Error(data.message || 'Failed to generate image');
            setResultImage(data.sheet_path);
            setProgress(100);
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card input-section">
                <div className="card-body">
                    <h1 className="card-title">Generate Poses</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Choose Art Style:</label>
                            <div className="form-check">
                            <input
                                    type="radio"
                                    className="form-check-input"
                                    id="GameArt"
                                    name="art-style"
                                    value="GameArt"
                                    checked={artStyle === 'GameArt'}
                                    onChange={() => setArtStyle('GameArt')}
                                />
                                <label className="form-check-label" htmlFor="GameArt">Game Art</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="SimpleArt"
                                    name="art-style"
                                    value="SimpleArt"
                                    checked={artStyle === 'SimpleArt'}
                                    onChange={() => setArtStyle('SimpleArt')}
                                />
                                <label className="form-check-label" htmlFor="SimpleArt">Simple Art</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="AnimeArt"
                                    name="art-style"
                                    value="AnimeArt"
                                    checked={artStyle === 'AnimeArt'}
                                    onChange={() => setArtStyle('AnimeArt')}
                                />
                                <label className="form-check-label" htmlFor="AnimeArt">Anime Art</label>
                        
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="text-prompt" className="form-label">Enter Additional description:</label>
                            <textarea
                                className="form-control"
                                id="text-prompt"
                                rows="5"
                                value={textPrompt}
                                onChange={(e) => setTextPrompt(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-gen">Generate Turnaround sheet</button>
                    </form>
                </div>
            </div>
            <div className="result-section ml-5">
                {loading && (
                    <>
                        <Logo />
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p>Loading... {progress}%</p>
                    </>
                )}
                {error && <div className="error">{error}</div>}
                {resultImage && <img src={resultImage} alt="Result Image" className="result-img" />}
            </div>
        </div>
    );
}

export default GeneratePoses;
