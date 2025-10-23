import React from 'react';
import './PartnershipSection';
import htlogo from "../assets/partner-htlogo.png";
import CSEC from "../assets/CSEC.png";
import Footer from './Footer';

const PartnershipSection = () => {
  return (
    <div className="partnership-section">   
    {/* // <section className="partnership-section"> */}
      {/* ✅ Navbar */}
      {/* <div className="gallery-page"></div>
      <header className="header">
  
      </header> */}
      {/* About Header with Logo */}
      <header className="about-header">
        <h1 className="gallery-main-title">Partners & Sponsors</h1>
      </header>
      <div className="partnership-container">
        {/* <h1 className='gallery-main-title'>Partnership & Collaboration</h1> */}
        
        <div className="partners-logos">   
          <img src={CSEC} className="htlogos-1" alt="Heart In Tech logo" />
           <img src={htlogo} className="htlogos-1" alt="Heart In Tech logo" />
 
        </div>
      </div>
    
      <Footer />
    </div>
  );
};

export default PartnershipSection;
