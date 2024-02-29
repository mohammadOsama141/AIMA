import React from 'react';
import './Home.css';
import slide_demo from '../../assets/images/aima-1s-vdo.mp4';
//A1modelingassistant
export default function Home() {
  return (
    <>
    {/* this "home-wrapper" div encapsulates the entire home page view */}

    <div className="home-wrapper">
    {/* this is a section for the introductory stuff, including a little pitch and a slide demo */}
      <section className="intro-section">
        <div className="intro-badge-container">
          <span className="badge-text">         
            Powered By Advanced AI Models
          </span>
        </div>
        <div className="home-description-block">
          <h1 className="home-heading">
            AI Modeling Assistant
          </h1>
          <p className="intro-text">
            Streamline Character Design Poses and customizations With Automated Concept Art Modeling — where your imagination meets our technology to redefine animated storytelling.
          </p>
        </div>
        <div >
          <a className="try-aima-action-button" href="/">
                
                <span >
                    <svg aria-hidden="true"
                        focusable="false"
                        data-prefix="fas" data-icon="sparkles"
                        className="sparkles-icon"
                        role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M327.5 85.2c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L384 128l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 128l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 64 426.8 7.5C425.1 3 420.8 0 416 0s-9.1 3-10.8 7.5L384 64 327.5 85.2zM205.1 73.3c-2.6-5.7-8.3-9.3-14.5-9.3s-11.9 3.6-14.5 9.3L123.3 187.3 9.3 240C3.6 242.6 0 248.3 0 254.6s3.6 11.9 9.3 14.5l114.1 52.7L176 435.8c2.6 5.7 8.3 9.3 14.5 9.3s11.9-3.6 14.5-9.3l52.7-114.1 114.1-52.7c5.7-2.6 9.3-8.3 9.3-14.5s-3.6-11.9-9.3-14.5L257.8 187.4 205.1 73.3zM384 384l-56.5 21.2c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L384 448l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 448l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 384l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L384 384z">
                        </path>
                    </svg>      
                </span>
                <span className='try-aima-btn-text'>TRY AIMA</span>        
          </a>         
        </div>
            <div className='vdo-container'>
            <video className="demo-vdo-class" width="760" height="540" playsInline autoPlay loop>
                    <source src={slide_demo} type="video/mp4"/>
            </video>
            </div>
      </section>
      {/* end of introductory section */}

      {/* will add  turaround sheet feature section here*/}
      
      <section className='section1'>
        <div className='sec1-deccription-block'>
            <span><h1>Character Turnaround Sheets</h1></span>
            <span>Wrap up your long due character design with a few English words!
                Generate detailed character turaround sheets based on your own text descriptions 
                <br/>
            <span>
            <button type="button" class="btn-turnaround">Generate Turaround Sheets</button>
            </span>           
            </span>
        </div>
      </section>
    
      {/* Adding Customization feature section */}
      <section className='section2'>
      <div className='sec2-deccription-block'>
            <span><h1>Customize Characters</h1></span>
            <span>Select specific areas of your character image for customization —
                add, modify, or remove features as desired through a user-friendly brush tool.
                <br/>
            <span>
            <button type="button" class="btn-customize">Customize Character</button>
            </span>           
            </span>
        </div>
      </section>
       {/*will add  refinement feature section here*/}
       <section className='section3'>

       <div className='sec3-deccription-block'>
            <span><h1>Refine Characters</h1></span>
            <span>Make your character designs more visually appealing, Enhance the look and feel of your charcters with just a click!
                <br/>
            <span>
            <button type="button" class="btn-refine">Refine Character</button>
            </span>           
            </span>
        </div>
      </section>
  
    </div> {/* --> end of home div */}
    </>
  );
}
