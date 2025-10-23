import React, { useState, useRef, useEffect } from "react";
import "./Gallery";

import Navbar from "./Navbar";
import Footer from "./Footer";
import scrollIcon from "../assets/scrollbar.png";

import img1 from "../assets/g1.jpg";
import img2 from "../assets/g2.jpg";
import img3 from "../assets/g3.jpg";
import img4 from "../assets/g4.jpg";
import img5 from "../assets/g5.jpg";
import img6 from "../assets/g6.jpg";
import img7 from "../assets/g7.jpg";
import img8 from "../assets/g8.jpg";
import img9 from "../assets/g9.jpg";
import img10 from "../assets/g10.jpg";
import img11 from "../assets/g11.jpg";
import img13 from "../assets/g13.jpg";
import img14 from "../assets/g14.jpg";
import img15 from "../assets/g15.jpg";
import img16 from "../assets/g16.jpg";
import img17 from "../assets/g17.jpg";
import img18 from "../assets/g18.jpg";
import img19 from "../assets/g19.jpeg";
import img20 from "../assets/g20.jpeg";
import img21 from "../assets/g21.jpeg";
import img22 from "../assets/g22.jpeg";
import img23 from "../assets/g23.jpeg";
import img24 from "../assets/g24.jpeg";

const images = [
  img1, img4, img5, img6,
  img7, img8, img9, img10,
  img11, img2, img3, img19,
  img14, img15, img16, img13, img17, img18, 
  img20, img21, img22, img23, img24
];

const Gallery = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const imgRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);

  // Scroll to top logic
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Modal logic
  const openModal = (index) => {
    setCurrentIndex(index);
    setZoom(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setZoom(1);
  };

  const prevImage = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomStep = 0.1;
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z + zoomStep, 3));
    } else {
      setZoom((z) => Math.max(z - zoomStep, 1));
    }
  };

  return (
    <>
      {/* Optional inline CSS for scroll button */}
      <style>{`
        .scroll-top {
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 1000;
          display: none;
        }
        .scroll-top.visible {
          display: block;
        }
        .scroll-icon {
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .scroll-icon:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Navbar */}
      <Navbar hideNavbar={modalOpen} />

      <div className="gallery-page">
        {/* Header (currently empty) */}
        <header className="header"></header>

        {/* Image Gallery Section */}
        <section className="photo-gallery-section">
          <h1 className="gallery-main-title">Gallery</h1>
          <div className="photo-gallery-grid">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="photo-gallery-img"
                onClick={() => openModal(idx)}
              />
            ))}
          </div>
        </section>

        {/* Modal for Images */}
        {modalOpen && (
          <div className="photo-modal-overlay" onClick={closeModal}>
            <div
              className="photo-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="photo-modal-close" onClick={closeModal}>
                &times;
              </button>
              <button className="photo-modal-prev" onClick={prevImage}>
                &#10094;
              </button>
              <img
                ref={imgRef}
                src={images[currentIndex]}
                alt={`Gallery ${currentIndex + 1}`}
                className="photo-modal-img"
                style={{ transform: `scale(${zoom})` }}
                onWheel={handleWheel}
                draggable={false}
              />
              <button className="photo-modal-next" onClick={nextImage}>
                &#10095;
              </button>
            </div>
          </div>
        )}

        {/* Events Video Section */}
        <section className="video-gallery-section">
          <div className="event-title">Glimpse of Events</div>
          <div className="video-gallery-grid">
            <iframe
              src="https://www.youtube.com/embed/_0bwK-LKj3g?si=fSV2nexbsxKo-yWi"
              title="Launch Event"
              className="video-gallery-iframe"
              allowFullScreen
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/8r2nA3dMy38?si=mpE1OfvWgsNDRSpj"
              title="Community Event"
              className="video-gallery-iframe"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      <a
          href="#top"
          className={`scroll-top ${showScroll ? "visible" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          <img src={scrollIcon} alt="Scroll to top" className="scroll-icon" />
        </a>
        {/* Footer */}
        <Footer />

        {/* ✅ Scroll-to-top button */}
  
      </div>
    </>
  );
};

export default Gallery;
