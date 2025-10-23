import React, { useRef, useState } from 'react';
import Footer from './Footer';
import './Contact'; 
import backgroundImage from '../assets/Homepage.jpg';
import emailjs from '@emailjs/browser';
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Contact() {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);

const SERVICE_ID  = 'service_11r934o';
const TEMPLATE_ID = 'template_9h5nj1n';
const PUBLIC_KEY  = 'ck4W16jUVAs4a3fV1';


  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        () => {
          setSubmitted(true);
          form.current.reset();
          setTimeout(() => setSubmitted(false), 3000);
        },
        (error) => {
          console.error('FAILED...', error.text);
        }
      );
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div
        className="contact-hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1>Contact</h1>
      </div>

      {/* Contact Form */}
      <div className="contact-form-wrapper">
        <h2>Contact Us</h2>
        <p>
          Fields marked with <span className="required">*</span> are required
        </p>
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <label>
            Name <span className="required">*</span>
            <input type="text" name="user_name" required />
          </label>

          <label>
            Email <span className="required">*</span>
            <input type="email" name="user_email" required />
          </label>

          <label>
            Message <span className="required">*</span>
            <textarea name="message" rows="6" required></textarea>
          </label>

          <button type="submit" disabled={submitted}>
            {submitted ? 'Message Sent!' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Social Media Icons */}
      <div className="social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
