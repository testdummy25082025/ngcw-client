import React from 'react';
import './Footer';
import htlogo from "../assets/htlogofooter.png";
import htheart from "../assets/htheart.png";

const Footer = () => {
  return (
    <footer>
        <div><section className='footer'>
        <p className="footer-text">
        <span className="footer-copy"> © 2025  NexGenCyberWomen. </span>{" "}| All Rights Reserved. |{" "}
        <span className="footer-dev">made with</span>
          <img src={htheart} className="htlogos" alt="Heart In Tech logo" /><span className="footer-dev">by</span>
          <a href="http://heartintech.com" className="footer-link">
            <img src={htlogo} className="htlogo" alt="Heart In Tech logo" />
          </a>
        </p></section>
      </div>
    </footer>
  );
};

export default Footer;
