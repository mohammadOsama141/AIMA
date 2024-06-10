from diffusers import StableDiffusionPipeline
from diffusers import StableDiffusionXLInpaintPipeline
import torch
from IPython.display import Image#, make_image_grid
import cv2
import torch
from diffusers.utils import load_image
from diffusers import StableDiffusionXLAdapterPipeline, T2IAdapter, EulerAncestralDiscreteScheduler, AutoencoderKL
from diffusers.utils import load_image
from controlnet_aux.lineart import LineartDetector
import torch
import logging

# num_poses, art_style, gender, hair_color,
def poseGen(art_style,  text_prompt):
    # Load model (should be moved to global context if possible for performance)
    pipeline = StableDiffusionPipeline.from_single_file(
        "E:/code work/aima/app/models/v1-5-pruned-emaonly.safetensors"
    ).to("cuda")
    pipeline.load_lora_weights("E:/code work/aima/app/models/", weight_name="v3.safetensors")

    # Prepare prompts
    fixedprompt = "<lora:v3:0.8>, <in_morte>, a character turnaround, {art_style} "
    full_prompt = f"{fixedprompt}, {text_prompt}"
    neg_prompt = 'ugly, boring, bad anatomy, blurry, pixelated, obscure, unnatural colors, poor lighting, dullness, and unclear, ugly face, disfigured'

    # Generate image
    image = pipeline(prompt=full_prompt, negative_prompt=neg_prompt, num_inference_steps=70,
                     height=512, width=768, guidance_scale=7, guidance_rescale=0.7).images[0]

    image.save("static/uploads/concept-sheet.png")

    return 'static/uploads/concept-sheet.png'

#see what to return
#wheter the image itself or its path
def inpaint(textprompt, init_image, mask_image):
    init_image = load_image(init_image)
    mask_image = load_image(mask_image)
    try: #if model is already loaded
        image = pipeline(
        prompt=textprompt, 
        image=init_image, 
        mask_image=mask_image, 
        num_inference_steps=50, 
        strength=0.80
        ).images[0]
        #print("enetred tried")
        
    except: #first time loadup
        pipeline  = StableDiffusionXLInpaintPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
        )
        pipeline .to("cuda")

        image = pipeline(
            prompt=textprompt, 
            image=init_image, 
            
            mask_image=mask_image, 
            num_inference_steps=50, 
            strength=0.80
        ).images[0]
        #print("enetred except")

    image.save("static/uploads/customized_image.png")
    
    return "static/uploads/customized_image.png"



def refine(text_prompt, image_path):
    # Load adapter
    adapter = T2IAdapter.from_pretrained(
        "TencentARC/t2i-adapter-lineart-sdxl-1.0", torch_dtype=torch.float16, variant="fp16"
    ).to("cuda")

    # Load scheduler and VAE
    model_id = 'stabilityai/stable-diffusion-xl-base-1.0'
    euler_a = EulerAncestralDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
    vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
    
    # Load pipeline
    pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
        model_id, vae=vae, adapter=adapter, scheduler=euler_a, torch_dtype=torch.float16, variant="fp16",
    ).to("cuda")
    pipe.enable_xformers_memory_efficient_attention()

    # Load and process the line art detector
    line_detector = LineartDetector.from_pretrained("lllyasviel/Annotators").to("cuda")
    image = load_image(image_path)
    image = line_detector(image, detect_resolution=384, image_resolution=1024)

    # Define negative prompt
    negative_prompt = "graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured"
    
    # Generate images
    gen_images = pipe(
        prompt=text_prompt,
        negative_prompt=negative_prompt,
        image=image,
        num_inference_steps=30,
        adapter_conditioning_scale=0.8,
        guidance_scale=7.5,
    ).images[0]
    
    output_path = f"static/uploads/refined_image.png"
    gen_images.save(output_path)

    return output_path
