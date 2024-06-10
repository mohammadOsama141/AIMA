from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import os
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pydantic import BaseModel, validator
import time
from .functions import poseGen, inpaint, refine
import traceback
import base64
import uuid
import logging

# for api to frontend communication
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# a dir to hold the uploaded images by user
UPLOAD_DIRECTORY = "static/uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


class Point(BaseModel):
    x: float
    y: float
    action: str

    @validator('x', 'y', pre=True)
    def convert_float_to_int(cls, v):
        return int(round(v))


class DrawRequest(BaseModel):
    points: list[Point]
    image_path: str


# end point -> for uploading image
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(UPLOAD_DIRECTORY, f"{file.filename}")
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # Resize the image to 512x512
        img = cv2.imread(file_location)
        resized_img = cv2.resize(img, (512, 512))
        cv2.imwrite(file_location, resized_img)  
        accessible_path = f"/static/uploads/{file.filename}"
        return {"filename": accessible_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload and resize image: {str(e)}")


# end point to process the selected coordinates by brush
@app.post("/process-points")
async def process_points(request: DrawRequest):
    image_path = request.image_path.strip('/')
    full_image_path = os.path.join("static", image_path.lstrip("/static/"))
    orig_img = cv2.imread(full_image_path)
    if orig_img is None:
        raise HTTPException(status_code=404, detail="Original image not found")

    # Create a mask of the same size as the resized image
    mask = np.zeros((512, 512), dtype=np.uint8)  # Ensure mask size is 512x512
    for point in request.points:
        x, y = int(round(point.x)), int(round(point.y))
        color = 255 if point.action == 'add' else 0
        cv2.circle(mask, (x, y), 10, color, -1)

    mask_color = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    final_img = cv2.addWeighted(orig_img, 0.7, mask_color, 0.3, 0)

    result_path = os.path.join(UPLOAD_DIRECTORY, "result.png")
    mask_path = os.path.join(UPLOAD_DIRECTORY, "mask.png")
    cv2.imwrite(result_path, final_img)
    cv2.imwrite(mask_path, mask)  # Save the mask image separately

    timestamp = int(time.time() * 1000)
    result_accessible_path = f"/static/uploads/result.png?{timestamp}"
    mask_accessible_path = f"/static/uploads/mask.png?{timestamp}"

    return {"image_path": result_accessible_path, "mask_path": mask_accessible_path}


# end point -> that calls for charcter customization 
class TextPrompt(BaseModel):
    text_prompt: str
    input_img_path: str


@app.post("/customize-image")
async def customize_image(text_prompt: TextPrompt):
    try:
        # Convert web path to filesystem path
        base_dir = "static/uploads"  # Ensure this is correct as per your server configuration
        input_image_filename = text_prompt.input_img_path.split('/')[-1]  # Extract filename
        full_input_img_path = os.path.join(base_dir, input_image_filename)
        mask_path = os.path.join(base_dir, 'mask.png')  # Assume mask.png is also in the same directory
        
        # Call the inpaint function
        customized_img = inpaint(text_prompt.text_prompt, full_input_img_path, mask_path)
        
        # Assume inpaint returns a filename, not a path
        return {"customized_image": f"{customized_img}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class PosePrompt(BaseModel):
    text_prompt: str
    art_style: str

    
@app.post("/generate-poses")
async def generate_poses(prompt: PosePrompt):
    try:
        image_path = poseGen(prompt.art_style, prompt.text_prompt)
        return {"sheet_path": image_path}
    except Exception as e:
        # Log the full traceback and error message
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": str(e)})
    


class ImageData(BaseModel):
    refine_text_prompt: str
    image_data: str  # This is expected to be a Base64 encoded string

def get_file_extension(content_type: str) -> str:
    """ Get the file extension based on the content type. """
    if 'image/jpeg' in content_type or 'image/jpg' in content_type:
        return '.jpg'
    elif 'image/png' in content_type:
        return '.png'
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

@app.post("/refine-character")
async def refine_character(data: ImageData):
    try:
        # Decode the base64 string
        header, encoded = data.image_data.split(',', 1)
        img_bytes = base64.b64decode(encoded)
        file_extension = get_file_extension(header)

        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join('static/uploads', unique_filename)

        # Write the image data to a file
        with open(file_path, 'wb') as f:
            f.write(img_bytes)

        # Call the refine function (assuming it's implemented elsewhere in your code)
        output_path = refine(data.refine_text_prompt, file_path)
        return JSONResponse(content={"message": "File refined successfully", "path": output_path})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-file")
async def download_file():
    file_path = "path_to_file"
    if not os.path.exists(file_path):
        logging.error("File not found: " + file_path)
        raise HTTPException(status_code=404, detail="File not found")
    return  JSONResponse(file_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
