# AIMA - AI Modeling Assistant

## Overview

This application is designed to bring creative character designs to life. Leveraging the power of ReactJS for the frontend and Python FastAPI for the backend, it offers users a suite of tools for generating, customizing, and refining character images using advanced diffusion models. The project is structured to separate concerns between client-side interactions and server-side processing, ensuring a responsive and intuitive user experience.

## Features

- Character Turnaround Sheets: 
    Generate a detailed character sheet based on text prompts provided by the user, utilizing locally saved diffusion models for image creation.

- Character Customization: 
    Allows users to select specific areas of a character image for customization, adding or modifying features as desired through a user-friendly brush tool.

- Character Refinement: 
    Refine character designs to enhance aesthetics or adjust details, again powered by advanced diffusion model technology.


## Geting Started 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


### Prerequisites

- Node.js and npm
- Python 3.8 or higher
- Pip for Python package installation


### Frontend Setup

- Navigate to the frontend directory and install dependencies:
    - `cd frontend`
    - `npm install`

- Start the development server:
    - `npm start`

The React app should now be running on (http://localhost:3000/)


### Backend Setup

- Navigate to the backend directory and create a virtual environment:
    - `cd ../backend`
    - `python -m venv venv`

- Activate the virtual environment:
    - On Windows: `venv\Scripts\activate`

- Install dependencies:
    - `pip install -r requirements.txt`

- Start the FastAPI server:
    - `uvicorn main:app --reload`



