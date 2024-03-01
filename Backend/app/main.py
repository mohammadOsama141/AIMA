from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import numpy as np
import cv2
from PIL import Image
import shutil
from pathlib import Path

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Directory setup for uploaded and processed images
UPLOAD_DIR = Path("uploaded_images")
PROCESS_DIR = Path("masked_images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PROCESS_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")
app.mount("/masked_images", StaticFiles(directory="masked_images"), name="masked_images")


class DrawRequest(BaseModel):
    filename: str
    point: dict
    action: str


@app.post("/upload_image/")
async def upload_image(image: UploadFile = File(...)):
    file_path = UPLOAD_DIR / image.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    url = f"http://localhost:8000/uploaded_images/{image.filename}"
    return {"url": url}


@app.post("/draw_mask")
async def draw_mask(request: DrawRequest):
    # Load the specific uploaded image
    file_path = UPLOAD_DIR / request.filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    raw_image = Image.open(file_path).convert("RGB")
    orig_img = np.array(raw_image)
    mask = np.zeros(orig_img.shape[:2], dtype=np.uint8)  # Initialize mask

    # Update mask based on the request
    point = request.point
    action = request.action  # 'add' or 'remove'
    brush_size = 10  # Brush size

    if action == 'add':
        cv2.circle(mask, (int(point['x']), int(point['y'])), brush_size, 1, -1)
    elif action == 'remove':
        cv2.circle(mask, (int(point['x']), int(point['y'])), brush_size, 0, -1)

    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE, (brush_size, brush_size))
    mask_dilated = cv2.dilate(mask, kernel)

    # Apply mask to image
    mask_img = np.stack([mask_dilated * 255] * 3, axis=-1)
    final_img = cv2.addWeighted(orig_img, 1, mask_img, 0.5, 0)
    final_img = cv2.cvtColor(final_img, cv2.COLOR_BGR2RGB)

    # Save the combined image
    result_path = PROCESS_DIR / f"result_{request.filename}"
    cv2.imwrite(str(result_path), final_img)

    # Optionally, save the mask image
    mask_path = PROCESS_DIR / f"mask_{request.filename}"
    cv2.imwrite(str(mask_path), mask_dilated * 255)  # Save mask as a b&w image

    return JSONResponse(content={
        'image_path': str(result_path), 'mask_path': str(mask_path)
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
